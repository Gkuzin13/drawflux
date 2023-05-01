import type Konva from 'konva';
import { type KonvaEventObject, type NodeConfig } from 'konva/lib/Node';
import { type IRect } from 'konva/lib/types';
import { Util } from 'konva/lib/Util';
import {
  type PropsWithRef,
  forwardRef,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Layer, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import type { NodeObject, Point } from 'shared';
import { CURSOR } from '@/constants/cursor';
import { BACKGROUND_LAYER_ID } from '@/constants/element';
import {
  STAGE_CONTEXT_MENU_ACTIONS,
  NODE_CONTEXT_MENU_ACTIONS,
  type ContextMenuItem,
} from '@/constants/menu';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { controlActions, selectControl } from '@/stores/slices/controlSlice';
import { nodesActions, selectNodes } from '@/stores/slices/nodesSlice';
import {
  type StageConfigState,
  selectStageConfig,
  stageConfigActions,
} from '@/stores/slices/stageConfigSlice';
import { debounce } from '@/utils/debounce';
import { drawRectangle } from '@/utils/draw';
import { createNode } from '@/utils/node';
import ContextMenu from '../ContextMenu/ContextMenu';
import NodesLayer from '../NodesLayer';
import SelectTool from '../SelectTool';
import { drawArrow } from '../shapes/ArrowDrawable/helpers/drawArrow';
import { drawEllipse } from '../shapes/EllipseDrawable/helpers/drawEllipse';
import { drawFreePath } from '../shapes/FreePathDrawable/helpers/drawFreePath';
import { drawRect } from '../shapes/RectDrawable/helpers/drawRect';
import {
  calcNewStagePositionAndScale,
  hasStageScaleReachedLimit,
} from './helpers/zoom';

type Props = PropsWithRef<{
  config: NodeConfig;
  containerStyle?: React.CSSProperties;
  onConfigChange: (config: Partial<StageConfigState>) => void;
}>;

type Ref = Konva.Stage;

type ContextMenuState = {
  items: ContextMenuItem[];
  position: Point;
};

const DrawingCanvas = forwardRef<Ref, Props>(
  ({ config, containerStyle, onConfigChange }, ref) => {
    const [draftNode, setDraftNode] = useState<NodeObject | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(
      null,
    );
    const [selectRect, setSelectRect] = useState<IRect | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [draggingStage, setDraggingStage] = useState(false);
    const [intersectedNodes, setIntersectedNodes] = useState<NodeObject[]>([]);

    const { selectedNodeId, selectedNodesIds, toolType } =
      useAppSelector(selectControl);
    const stageConfig = useAppSelector(selectStageConfig);

    const { nodes } = useAppSelector(selectNodes).present;

    const dispatch = useAppDispatch();

    const moveStartPosition = useRef<Point>([0, 0]);
    const selectRectRef = useRef<Konva.Rect>(null);

    const cursorStyle = useMemo(() => {
      switch (toolType) {
        case 'hand':
          return draggingStage ? CURSOR.GRABBING : CURSOR.GRAB;
        case 'select':
          return CURSOR.DEFAULT;
        default:
          return drawing ? CURSOR.CROSSHAIR : CURSOR.DEFAULT;
      }
    }, [drawing, toolType, draggingStage]);

    const offsetBackgroundLayerRect = useMemo<IRect>(() => {
      if (!ref || typeof ref === 'function' || !ref.current) {
        return {
          x: 0,
          y: 0,
          width: config.width || 0,
          height: config.height || 0,
        };
      }

      const stage = ref.current;

      const { position, scale } = stageConfig;

      return {
        x: -position.x / scale,
        y: -position.y / scale,
        width: stage.width() / scale,
        height: stage.height() / scale,
      };
    }, [stageConfig, ref, config.width, config.height]);

    const handleContextMenuAction = (key: ContextMenuItem['key']) => {
      switch (key) {
        case 'delete-node': {
          if (!selectedNodeId) return;
          dispatch(nodesActions.delete([selectedNodeId]));
          break;
        }
        case 'select-all': {
          dispatch(
            controlActions.setSelectedNodesIds(
              nodes.map((node) => node.nodeProps.id),
            ),
          );
          break;
        }
        case 'select-none': {
          dispatch(controlActions.setSelectedNodesIds([]));
          break;
        }
      }

      dispatch(controlActions.setSelectedNodeId(null));
      setContextMenu(null);
    };

    const dispatchSelectedNodesIds = useCallback(
      debounce(() => {
        dispatch(
          controlActions.setSelectedNodesIds(
            intersectedNodes.map((node) => node.nodeProps.id),
          ),
        );
      }, 35),
      [dispatch, intersectedNodes],
    );

    const setIntersectingNodes = (stage: Konva.Stage, selectRect: IRect) => {
      const layer = stage.getLayers()[0];
      const children = layer.getChildren((child) => child.attrs.id);

      const intersectedChildren = children.filter((child) => {
        if (child.hasChildren()) {
          const group = child as Konva.Group;

          return group.getChildren().some((c) => {
            return Util.haveIntersection(selectRect, c.getClientRect());
          });
        }
        return Util.haveIntersection(selectRect, child.getClientRect());
      });

      const intersectedIds: string[] = intersectedChildren.map(
        (child) => child.attrs.id,
      );

      setIntersectedNodes(
        nodes.filter((node) => intersectedIds.includes(node.nodeProps.id)),
      );

      dispatchSelectedNodesIds();
    };

    const handleOnContextMenu = (e: KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage() as Konva.Stage;
      const position = stage.getRelativePointerPosition();

      const clickedOnEmpty = e.target === stage;

      if (clickedOnEmpty) {
        setContextMenu({
          items: [...STAGE_CONTEXT_MENU_ACTIONS],
          position: [position.x, position.y],
        });
        return;
      }

      const shape =
        e.target.parent?.nodeType === 'Group' ? e.target.parent : e.target;

      const node = nodes.find((node) => node.nodeProps.id === shape?.id());

      if (node) {
        dispatch(controlActions.setSelectedNodeId(node.nodeProps.id));
        setContextMenu({
          items: [...NODE_CONTEXT_MENU_ACTIONS],
          position: [position.x, position.y],
        });
      }
    };

    const drawNodeByType = (node: NodeObject, position: Point): NodeObject => {
      switch (node.type) {
        case 'draw': {
          return drawFreePath(node, position);
        }
        case 'arrow': {
          return drawArrow(node, position);
        }
        case 'rectangle': {
          return drawRect(node, moveStartPosition.current, position);
        }
        case 'ellipse': {
          return drawEllipse(node, position);
        }
        default: {
          return node;
        }
      }
    };

    const onStagePress = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const isMouseEvent = event.type === 'mousedown';

      if (isMouseEvent && (event.evt as MouseEvent).button !== 0) {
        return;
      }

      const stage = event.target.getStage();

      const clickedOnEmpty = event.target === stage;
      if (!clickedOnEmpty) {
        return;
      }

      if (contextMenu) {
        setContextMenu(null);
        return;
      }

      const { x, y } = stage.getRelativePointerPosition();

      moveStartPosition.current = [x, y];

      switch (toolType) {
        case 'hand':
          return;
        case 'select':
          setSelectRect(drawRectangle([moveStartPosition.current, [x, y]]));
          setDrawing(true);
          break;
        case 'text':
          setDraftNode(createNode(toolType, [x, y]));
          break;
        default:
          setDraftNode(createNode(toolType, [x, y]));
          setDrawing(true);
          break;
      }

      if (selectedNodeId) {
        dispatch(controlActions.setSelectedNodeId(null));
      }

      if (selectedNodesIds.length) {
        setIntersectedNodes([]);
        dispatch(controlActions.setSelectedNodesIds([]));
      }
    };

    const onStageMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = event.target.getStage();

      if (!drawing || !stage) return;

      const { x, y } = stage.getRelativePointerPosition();

      if (toolType === 'select' && selectRectRef.current) {
        setSelectRect(drawRectangle([moveStartPosition.current, [x, y]]));
        setIntersectingNodes(stage, selectRectRef.current.getClientRect());
        return;
      }

      setDraftNode((prevNode) => {
        return prevNode ? drawNodeByType(prevNode, [x, y]) : prevNode;
      });
    };

    const onStageMoveEnd = () => {
      switch (toolType) {
        case 'select':
          setSelectRect(null);
          setDrawing(false);
          break;
        case 'draw':
          if (!draftNode) return;
          handleDraftEnd(draftNode, false);
          break;
        case 'text':
          break;
        case 'arrow':
          if (!draftNode || !drawing) return;

          if (!draftNode.nodeProps.points) {
            setDrawing(false);
            setDraftNode(null);
            break;
          }
          handleDraftEnd(draftNode);
          break;
        default: {
          if (!draftNode || !drawing) return;
          handleDraftEnd(draftNode);
        }
      }
    };

    const zoomStageRelativeToPointerPosition = (
      stage: Konva.Stage,
      event: WheelEvent,
    ) => {
      const { position, scale } = calcNewStagePositionAndScale(
        stage.scaleX(),
        stage.getRelativePointerPosition(),
        stage.getPosition(),
        event.deltaY,
      );

      if (!hasStageScaleReachedLimit(scale)) {
        onConfigChange({ scale, position });
      }
    };

    const handleStageOnWheel = (e: KonvaEventObject<WheelEvent>) => {
      const stage = e.target.getStage();

      if (e.evt.ctrlKey && stage) {
        e.evt.preventDefault();
        zoomStageRelativeToPointerPosition(stage, e.evt);
      }
    };

    const handleDraftEnd = (node: NodeObject, resetToolType = true) => {
      setDraftNode(null);

      if (node.type === 'text' && !node.text) {
        return;
      }

      dispatch(nodesActions.add([node]));
      setDrawing(false);

      if (resetToolType) {
        dispatch(controlActions.setToolType('select'));
      }
    };

    const handleStageDragMove = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target !== event.target.getStage()) {
          return;
        }
        const stage = event.target;
        const layer = stage.getLayers()[0];

        const backgroundLayerRect = layer.children?.find(
          (child) => child.id() === BACKGROUND_LAYER_ID,
        );

        if (!backgroundLayerRect) {
          return;
        }

        const { scale } = stageConfig;

        backgroundLayerRect.position({
          x: -stage.x() / scale,
          y: -stage.y() / scale,
        });
      },
      [stageConfig],
    );

    const handleStageDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target.getStage() !== event.target) {
          return;
        }

        const stage = event.target;

        dispatch(
          stageConfigActions.set({
            ...stageConfig,
            position: stage.position(),
          }),
        );

        setDraggingStage(false);
      },
      [stageConfig, dispatch],
    );

    return (
      <Stage
        ref={ref}
        {...config}
        style={{ ...containerStyle, cursor: cursorStyle }}
        draggable={toolType === 'hand'}
        onMouseDown={onStagePress}
        onMouseMove={onStageMove}
        onMouseUp={onStageMoveEnd}
        onTouchStart={onStagePress}
        onTouchMove={onStageMove}
        onTouchEnd={onStageMoveEnd}
        onContextMenu={handleOnContextMenu}
        onWheel={handleStageOnWheel}
        onDragStart={() => setDraggingStage(true)}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
      >
        <NodesLayer
          nodes={nodes}
          draftNode={draftNode}
          selectedNodeId={selectedNodeId}
          selectedNodesIds={selectedNodesIds}
          toolType={toolType}
          config={{ ...config, listening: !drawing }}
          backgroundLayerRect={offsetBackgroundLayerRect}
          onDraftEnd={handleDraftEnd}
        >
          <Html
            groupProps={{
              x: contextMenu?.position[0],
              y: contextMenu?.position[1],
            }}
            transformFunc={(attrs) => {
              return { ...attrs, scaleX: 1, scaleY: 1 };
            }}
          >
            {contextMenu && (
              <ContextMenu
                items={contextMenu.items}
                onAction={handleContextMenuAction}
              />
            )}
          </Html>
        </NodesLayer>
        {selectRect && (
          <Layer>
            <SelectTool rect={selectRect} ref={selectRectRef} />
          </Layer>
        )}
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
