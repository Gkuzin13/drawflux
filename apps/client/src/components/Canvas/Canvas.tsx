import type Konva from 'konva';
import { type KonvaEventObject, type NodeConfig } from 'konva/lib/Node';
import type { IRect } from 'konva/lib/types';
import {
  type PropsWithRef,
  forwardRef,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Stage } from 'react-konva';
import type { NodeObject, Point, StageConfig } from 'shared';
import { CURSOR } from '@/constants/cursor';
import { BACKGROUND_LAYER_ID } from '@/constants/element';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import {
  contextMenuActions,
  selectContextMenu,
} from '@/stores/slices/contextMenu';
import { nodesActions, selectCurrentNodes } from '@/stores/slices/nodesSlice';
import { createNode } from '@/utils/node';
import BackgroundRect from '../BackgroundRect';
import ContextMenu from '../ContextMenu/ContextMenu';
import NodesLayer from '../NodesLayer';
import SelectRect from '../SelectRect';
import { drawArrow } from '../shapes/ArrowDrawable/helpers/drawArrow';
import { drawEllipse } from '../shapes/EllipseDrawable/helpers/drawEllipse';
import { drawFreePath } from '../shapes/FreePathDrawable/helpers/drawFreePath';
import { drawRect } from '../shapes/RectDrawable/helpers/drawRect';
import { getIntersectingChildren } from './helpers/intersect';
import {
  calcNewStagePositionAndScale,
  hasStageScaleReachedLimit,
} from './helpers/zoom';

type Props = PropsWithRef<{
  config: NodeConfig;
  containerStyle?: React.CSSProperties;
  intersectedNodesIds: string[];
  onNodesIntersection: (nodesIds: string[]) => void;
  onConfigChange: (config: Partial<StageConfig>) => void;
}>;

type Ref = Konva.Stage;

type DrawPosition = {
  start: Point;
  current: Point;
};

const initialDrawPosition: DrawPosition = {
  start: [0, 0],
  current: [0, 0],
};

const DrawingCanvas = forwardRef<Ref, Props>(
  (
    {
      config,
      containerStyle,
      intersectedNodesIds,
      onNodesIntersection,
      onConfigChange,
    },
    ref,
  ) => {
    const [draftNode, setDraftNode] = useState<NodeObject | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [drawPosition, setDrawPosition] = useState(initialDrawPosition);
    const [draggingStage, setDraggingStage] = useState(false);

    const { stageConfig, toolType, selectedNodesIds } =
      useAppSelector(selectCanvas);
    const nodes = useAppSelector(selectCurrentNodes);
    const contextMenuState = useAppSelector(selectContextMenu);

    const dispatch = useAppDispatch();

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

    useEffect(() => {
      if (typeof ref === 'function' || !ref?.current) {
        return;
      }
      const container = ref.current.container();

      container.tabIndex = 1;
      container.focus();
    }, [ref, toolType, selectedNodesIds, stageConfig]);

    const getIntersectedNodes = useCallback(
      (stage: Konva.Stage, rect: IRect) => {
        const layer = stage.getLayers()[0];
        const children = layer.getChildren((child) =>
          nodes.some((node) => node.nodeProps.id === child.id()),
        );

        if (!children.length) return [];

        const intersectedChildren = getIntersectingChildren(children, rect);

        return [...new Set(intersectedChildren.map((child) => child.id()))];
      },
      [nodes],
    );

    const handleOnContextMenu = useCallback(
      (e: KonvaEventObject<PointerEvent>) => {
        e.evt.preventDefault();

        const stage = e.target.getStage() as Konva.Stage;
        const position = stage.getRelativePointerPosition();
        const clickedOnEmpty = e.target === stage;

        if (clickedOnEmpty) {
          dispatch(
            contextMenuActions.open({
              type: 'drawing-canvas-menu',
              position,
            }),
          );
          return;
        }

        const shape =
          e.target.parent?.nodeType === 'Group' ? e.target.parent : e.target;

        const node = nodes.find((node) => node.nodeProps.id === shape?.id());

        if (node) {
          dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }
        dispatch(
          contextMenuActions.open({
            type: 'node-menu',
            position,
          }),
        );
      },
      [nodes, dispatch],
    );

    const drawNodeByType = useCallback(
      (node: NodeObject, position: Point): NodeObject => {
        switch (node.type) {
          case 'draw': {
            return drawFreePath(node, position);
          }
          case 'arrow': {
            return drawArrow(node, position);
          }
          case 'rectangle': {
            return drawRect(node, drawPosition?.start, position);
          }
          case 'ellipse': {
            return drawEllipse(node, position);
          }
          default: {
            return node;
          }
        }
      },
      [drawPosition],
    );

    const handleDraftEnd = useCallback(
      (node: NodeObject, resetToolType = true) => {
        setDraftNode(null);

        if (node.type === 'text' && !node.text) {
          return;
        }

        dispatch(nodesActions.add([node]));
        setDrawing(false);

        if (resetToolType) {
          dispatch(canvasActions.setToolType('select'));
        }
      },
      [dispatch],
    );

    const onStagePress = useCallback(
      (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        const isMouseEvent = event.type === 'mousedown';

        if (isMouseEvent && (event.evt as MouseEvent).button !== 0) {
          return;
        }

        const stage = event.target.getStage();

        const clickedOnEmpty = event.target === stage;

        if (!clickedOnEmpty) {
          return;
        }

        if (contextMenuState.opened) {
          dispatch(contextMenuActions.close());
          return;
        }

        const { x, y } = stage.getRelativePointerPosition();

        setDrawPosition({ start: [x, y], current: [x, y] });

        switch (toolType) {
          case 'hand':
            return;
          case 'select':
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

        if (Object.keys(intersectedNodesIds).length) {
          onNodesIntersection([]);
        }
      },
      [
        contextMenuState.opened,
        toolType,
        intersectedNodesIds,
        dispatch,
        onNodesIntersection,
      ],
    );

    const onStageMove = useCallback(
      (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        const stage = event.target.getStage();

        if (!drawing || !stage) return;

        const { x, y } = stage.getRelativePointerPosition();

        setDrawPosition((prevState) => {
          return { start: prevState.start, current: [x, y] };
        });

        if (toolType === 'select' && drawing && selectRectRef.current) {
          const selectRect = selectRectRef.current.getClientRect();

          onNodesIntersection(getIntersectedNodes(stage, selectRect));
          return;
        }

        setDraftNode((prevNode) => {
          return prevNode ? drawNodeByType(prevNode, [x, y]) : prevNode;
        });
      },
      [
        drawing,
        toolType,
        drawNodeByType,
        getIntersectedNodes,
        selectRectRef,
        onNodesIntersection,
      ],
    );

    const onStageMoveEnd = useCallback(() => {
      switch (toolType) {
        case 'select': {
          dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
          setDrawing(false);
          break;
        }
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
    }, [
      draftNode,
      drawing,
      toolType,
      intersectedNodesIds,
      dispatch,
      handleDraftEnd,
    ]);

    const zoomStageRelativeToPointerPosition = useCallback(
      (stage: Konva.Stage, event: WheelEvent) => {
        const { position, scale } = calcNewStagePositionAndScale(
          stage.scaleX(),
          stage.getRelativePointerPosition(),
          stage.getPosition(),
          event.deltaY,
        );

        if (!hasStageScaleReachedLimit(scale)) {
          onConfigChange({ scale, position });
        }
      },
      [onConfigChange],
    );

    const handleStageOnWheel = useCallback(
      (e: KonvaEventObject<WheelEvent>) => {
        const stage = e.target.getStage();

        if (e.evt.ctrlKey && stage) {
          e.evt.preventDefault();
          zoomStageRelativeToPointerPosition(stage, e.evt);
        }
      },
      [zoomStageRelativeToPointerPosition],
    );

    const handleStageDragMove = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target !== event.target.getStage()) {
          return;
        }
        const stage = event.target;
        const layer = stage.getLayers()[0];

        const BackgroundRectRect = layer.children?.find(
          (child) => child.id() === BACKGROUND_LAYER_ID,
        );

        if (!BackgroundRectRect) {
          return;
        }

        const { scale } = stageConfig;

        BackgroundRectRect.position({
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
          canvasActions.setStageConfig({
            ...stageConfig,
            position: stage.position(),
          }),
        );

        setDraggingStage(false);
      },
      [stageConfig, dispatch],
    );

    const handleNodesChange = (nodes: NodeObject[]) => {
      dispatch(nodesActions.update(nodes));
    };

    const handleNodePress = (nodeId: string) => {
      if (toolType === 'select') {
        dispatch(canvasActions.setSelectedNodesIds([nodeId]));
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
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
      >
        <NodesLayer
          nodes={nodes}
          draftNode={draftNode}
          toolType={toolType}
          config={{ ...config, listening: !drawing || toolType !== 'select' }}
          selectedNodesIds={intersectedNodesIds}
          onNodePress={handleNodePress}
          onNodesChange={handleNodesChange}
          onDraftEnd={handleDraftEnd}
        >
          <BackgroundRect stageRef={ref} stageConfig={stageConfig} />
          {drawing && toolType === 'select' && (
            <SelectRect
              ref={selectRectRef}
              startPoint={drawPosition.start}
              currentPoint={drawPosition.current}
            />
          )}
          <ContextMenu {...contextMenuState} />
        </NodesLayer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
