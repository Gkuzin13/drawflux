import type Konva from 'konva';
import { type KonvaEventObject, type NodeConfig } from 'konva/lib/Node';
import {
  type PropsWithRef,
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Stage } from 'react-konva';
import type { NodeObject, Point, StageConfig } from 'shared';
import { CURSOR } from '@/constants/cursor';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { uniq } from '@/utils/array';
import { createNode } from '@/utils/node';
import { getNormalizedInvertedRect } from '@/utils/position';
import BackgroundRect from '../BackgroundRect/BackgroundRect';
import NodesLayer from '../NodesLayer';
import SelectRect from '../SelectRect';
import { type DrawableType, drawTypes } from './helpers/draw';
import { getNodesIntersectingWithRect } from './helpers/stage';
import {
  calcNewStagePositionAndScale,
  isScaleOutOfRange,
} from './helpers/zoom';

type Props = PropsWithRef<{
  config: NodeConfig;
  containerStyle?: React.CSSProperties;
  intersectedNodesIds: string[];
  onNodesIntersection: (nodesIds: string[]) => void;
  onConfigChange: (config: Partial<StageConfig>) => void;
}>;

type Ref = Konva.Stage;

const Canvas = forwardRef<Ref, Props>(
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
    const [drawPosition, setDrawPosition] = useState<Point>([0, 0]);
    const [draggingStage, setDraggingStage] = useState(false);

    const { stageConfig, toolType, selectedNodesIds, nodes } =
      useAppSelector(selectCanvas);

    const dispatch = useAppDispatch();

    const selectRectRef = useRef<Konva.Rect>(null);
    const backgroundRectRef = useRef<Konva.Rect>(null);
    const drawStartPosition = useRef<Point>([0, 0]);

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

    const handleDraftEnd = useCallback(
      (node: NodeObject, resetToolType = true) => {
        setDraftNode(null);

        if (node.type === 'text' && !node.text) {
          return;
        }

        dispatch(canvasActions.addNodes([node]));
        setDrawing(false);

        if (resetToolType) {
          dispatch(canvasActions.setToolType('select'));
          dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }
      },
      [dispatch],
    );

    const handleSelectDraw = useCallback(
      (stage: Konva.Stage) => {
        if (!selectRectRef.current) {
          return;
        }

        const nodesIntersectedWithSelectRect = getNodesIntersectingWithRect(
          stage,
          nodes,
          selectRectRef.current.getClientRect(),
        );

        onNodesIntersection(
          uniq(nodesIntersectedWithSelectRect.map((node) => node.id())),
        );
      },
      [selectRectRef, nodes, onNodesIntersection],
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

        const { x, y } = stage.getRelativePointerPosition();
        const currentPoint: Point = [x, y];

        drawStartPosition.current = currentPoint;

        switch (toolType) {
          case 'hand':
            return;
          case 'select':
            setDrawing(true);
            setDrawPosition(currentPoint);
            break;
          case 'text':
            setDraftNode(createNode(toolType, currentPoint));
            break;
          default:
            setDrawing(true);
            setDrawPosition(currentPoint);
            setDraftNode(createNode(toolType, currentPoint));
            break;
        }

        if (Object.keys(intersectedNodesIds).length) {
          onNodesIntersection([]);
        }
      },
      [toolType, intersectedNodesIds, onNodesIntersection],
    );

    const onStageMove = useCallback(
      (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        const stage = event.target.getStage();

        if (!drawing || !stage) return;

        const { x, y } = stage.getRelativePointerPosition();
        const currentPoint: Point = [x, y];

        if (toolType === 'select') {
          setDrawPosition(currentPoint);
          handleSelectDraw(stage);
          return;
        }

        if (draftNode && draftNode.type !== 'text') {
          const drawFn = drawTypes[draftNode.type as DrawableType];
          const updatedNode = drawFn(
            draftNode,
            drawStartPosition.current,
            currentPoint,
          );
          setDraftNode(updatedNode);
        }
      },
      [drawing, toolType, draftNode, handleSelectDraw],
    );

    const onStageMoveEnd = useCallback(() => {
      setDrawing(false);

      if (toolType === 'select') {
        dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
        return;
      }

      if (draftNode) {
        const shouldResetToolType = toolType !== 'draw';
        handleDraftEnd(draftNode, shouldResetToolType);
      }
    }, [draftNode, toolType, intersectedNodesIds, dispatch, handleDraftEnd]);

    const zoomStageRelativeToPointerPosition = useCallback(
      (stage: Konva.Stage, event: WheelEvent) => {
        const { position, scale } = calcNewStagePositionAndScale(
          stage.scaleX(),
          stage.getRelativePointerPosition(),
          stage.getPosition(),
          event.deltaY,
        );

        if (!isScaleOutOfRange(scale)) {
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
        if (
          event.target !== event.target.getStage() ||
          !backgroundRectRef.current
        ) {
          return;
        }

        const stage = event.target;
        const backgroundRect = backgroundRectRef.current;

        const updatedPosition = getNormalizedInvertedRect(
          {
            x: stage.x(),
            y: stage.y(),
            width: stage.width(),
            height: stage.height(),
          },
          stage.scaleX(),
        );

        backgroundRect.position({ x: updatedPosition.x, y: updatedPosition.y });
      },
      [backgroundRectRef],
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
      dispatch(canvasActions.updateNodes(nodes));
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
        tabIndex={0}
        style={{ ...containerStyle, cursor: cursorStyle }}
        draggable={toolType === 'hand'}
        onMouseDown={onStagePress}
        onMouseMove={onStageMove}
        onMouseUp={onStageMoveEnd}
        onTouchStart={onStagePress}
        onTouchMove={onStageMove}
        onTouchEnd={onStageMoveEnd}
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
          <BackgroundRect
            ref={backgroundRectRef}
            stageRef={ref}
            stageConfig={stageConfig}
          />
          {drawing && toolType === 'select' && (
            <SelectRect
              ref={selectRectRef}
              startPoint={drawStartPosition.current}
              currentPoint={drawPosition}
            />
          )}
        </NodesLayer>
      </Stage>
    );
  },
);

Canvas.displayName = 'Canvas';

export default Canvas;
