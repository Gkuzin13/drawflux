import { NodeType, Point } from '@/client/shared/constants/element';
import { Stage } from 'react-konva';
import { ForwardedRef, forwardRef, useMemo, useRef, useState } from 'react';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from '@/client/stores/hooks';
import { KonvaEventObject, NodeConfig } from 'konva/lib/Node';
import {
  STAGE_CONTEXT_MENU_ACTIONS,
  NODE_CONTEXT_MENU_ACTIONS,
  ContextMenuItem,
} from '@/client/shared/constants/menu';
import { IRect } from 'konva/lib/types';
import { createNode } from '@/client/shared/utils/node';
import { drawRectangle } from '@/client/shared/utils/draw';
import { CURSOR } from '@/client/shared/constants/cursor';
import { drawFreePath } from '../shapes/FreePathDrawable/helpers/drawFreePath';
import { drawArrow } from '../shapes/ArrowDrawable/helpers/drawArrow';
import { drawRect } from '../shapes/RectDrawable/helpers/drawRect';
import { drawEllipse } from '../shapes/EllipseDrawable/helpers/drawEllipse';
import { nodesActions, selectNodes } from '@/client/stores/slices/nodesSlice';
import SelectTool from '../SelectTool';
import { Html } from 'react-konva-utils';
import ContextMenu from '../ContextMenu/ContextMenu';
import {
  controlActions,
  selectControl,
} from '@/client/stores/slices/controlSlice';
import {
  calcNewStagePositionAndScale,
  hasStageScaleReachedLimit,
} from './helpers/zoom';
import { StageConfigState } from '@/client/stores/slices/stageConfigSlice';
import NodesLayer from '../NodesLayer';
import CanvasBackgroundLayer from '../CanvasBackgroundLayer';

type Props = {
  config: NodeConfig;
  containerStyle?: React.CSSProperties;
  onConfigChange: (config: Partial<StageConfigState>) => void;
};

type ContextMenuState = {
  items: ContextMenuItem[];
  position: Point;
};

const DrawingCanvas = forwardRef(
  (
    { config, containerStyle, onConfigChange }: Props,
    ref: ForwardedRef<Konva.Stage>,
  ) => {
    const [draftNode, setDraftNode] = useState<NodeType | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(
      null,
    );
    const [selectRect, setSelectRect] = useState<IRect | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [draggingStage, setDraggingStage] = useState(false);
    const [intersectedNodes, setIntersectedNodes] = useState<NodeType[]>([]);

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

      dispatch(controlActions.unsetSelectedNode());
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

    const drawNodeByType = (node: NodeType, position: Point): NodeType => {
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

      if (clickedOnEmpty && contextMenu) {
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

      dispatch(controlActions.unsetSelectedNode());
      setIntersectedNodes([]);
      setContextMenu(null);
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

    const handleDraftEnd = (node: NodeType, resetToolType = true) => {
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
          {selectRect && <SelectTool rect={selectRect} ref={selectRectRef} />}
          <Html
            groupProps={{
              x: contextMenu?.position[0],
              y: contextMenu?.position[1],
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
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;