import type { NodeObject, Point } from '@shared';
import Konva from 'konva';
import { type KonvaEventObject, type NodeConfig } from 'konva/lib/Node';
import { type IRect } from 'konva/lib/types';
import {
  type PropsWithRef,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layer, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';
import { CURSOR } from '@/constants/cursor';
import {
  STAGE_CONTEXT_MENU_ACTIONS,
  NODE_CONTEXT_MENU_ACTIONS,
  type ContextMenuItem,
} from '@/constants/menu';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { controlActions, selectControl } from '@/stores/slices/controlSlice';
import { nodesActions, selectNodes } from '@/stores/slices/nodesSlice';
import type { StageConfigState } from '@/stores/slices/stageConfigSlice';
import { drawRectangle } from '@/utils/draw';
import { createNode } from '@/utils/node';
import CanvasBackgroundLayer from '../CanvasBackgroundLayer';
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

    const { selectedNodeId, toolType } = useAppSelector(selectControl);
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

    const onNodeMenuAction = (key: ContextMenuItem['key']) => {
      switch (key) {
        case 'delete-node':
          if (!selectedNodeId) return;
          dispatch(nodesActions.delete([selectedNodeId]));
          break;
        case 'select-all':
          setIntersectedNodes(nodes);
          break;
      }

      dispatch(controlActions.setSelectedNode(null));
      setContextMenu(null);
    };

    const setIntersectingNodes = (stage: Konva.Stage, selectRect: IRect) => {
      const layer = stage.getChildren((child) => child.nodeType === 'Layer')[1];
      const children = layer.getChildren((child) => child.attrs.id);

      const intersectedChildren = children.filter((child) => {
        if (child.hasChildren()) {
          const group = child as Konva.Group;

          return group.getChildren().some((c) => {
            return Konva.Util.haveIntersection(selectRect, c.getClientRect());
          });
        }

        return Konva.Util.haveIntersection(selectRect, child.getClientRect());
      });

      const intersectedIds = new Set<string>(
        intersectedChildren.map((child) => child.attrs.id),
      );

      setIntersectedNodes(
        nodes.filter((node) => intersectedIds.has(node.nodeProps.id)),
      );
    };

    const handleOnContextMenu = (e: KonvaEventObject<PointerEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage() as Konva.Stage;
      const position = stage.getRelativePointerPosition();

      const clickedOnEmpty = e.target === stage;

      if (clickedOnEmpty) {
        setContextMenu({
          items: STAGE_CONTEXT_MENU_ACTIONS,
          position: [position.x, position.y],
        });
        return;
      }

      const isGroup = e.target.parent?.nodeType === 'Group';
      const shape = isGroup ? e.target.parent : e.target;

      const node = nodes.find((node) => node.nodeProps.id === shape?.attrs.id);

      if (node) {
        dispatch(controlActions.setSelectedNode(node.nodeProps.id));
        setContextMenu({
          items: NODE_CONTEXT_MENU_ACTIONS,
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
      if (
        event.type === 'mousedown' &&
        (event.evt as MouseEvent).button !== 0
      ) {
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
        dispatch(controlActions.setSelectedNode(null));
      }

      if (intersectedNodes.length) {
        setIntersectedNodes([]);
      }
    };

    const onStageMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!drawing) return;

      const stage = event.target.getStage();

      if (!stage) return;

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
        onDragEnd={() => setDraggingStage(false)}
      >
        <CanvasBackgroundLayer config={config} />
        <NodesLayer
          nodes={nodes}
          draftNode={draftNode}
          selectedNodeId={selectedNodeId}
          toolType={toolType}
          intersectedNodes={intersectedNodes}
          config={{ listening: !drawing }}
          handleDraftEnd={handleDraftEnd}
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
                onAction={onNodeMenuAction}
              />
            )}
          </Html>
        </NodesLayer>
        {selectRect && (
          <Layer listening={!drawing}>
            <SelectTool rect={selectRect} ref={selectRectRef} />
          </Layer>
        )}
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
