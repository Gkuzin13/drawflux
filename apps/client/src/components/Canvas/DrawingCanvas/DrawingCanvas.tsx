import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  lazy,
  Suspense,
  useMemo,
  useEffect,
} from 'react';
import { Layer, Stage } from 'react-konva';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectSelectedNodesIds,
  selectToolType,
} from '@/stores/slices/canvas';
import { selectMyUser } from '@/stores/slices/collaboration';
import { createNode, isValidNode } from '@/utils/node';
import BackgroundLayer from '../Layers/BackgroundLayer';
import { drawNodeByType, type DrawPosition } from './helpers/draw';
import {
  getCursorStyle,
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getRelativePointerPosition,
} from './helpers/stage';
import { calculateStageZoom, isScaleOutOfRange } from './helpers/zoom';
import { throttleFn } from '@/utils/timed';
import { WS_THROTTLE_MS } from '@/constants/app';
import usePageMutation from '@/hooks/usePageMutation';
import { store } from '@/stores/store';
import NodesLayer from '../Layers/NodesLayer';
import { getNormalizedInvertedRect } from '@/utils/position';
import type { IRect } from 'konva/lib/types';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { DrawableNodeType, NodeObject, NodeType, Point } from 'shared';
import DraftNode from '../Node/DraftNode';
import SelectRect from '../SelectRect';

const CollaborationLayer = lazy(
  () => import('@/components/Canvas/Layers/CollaborationLayer'),
);

type Props = {
  size: {
    width: number;
    height: number;
  };
  onNodesSelect: (nodesIds: string[]) => void;
};

const DrawingCanvas = forwardRef<Konva.Stage, Props>(
  ({ size, onNodesSelect }, ref) => {
    const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>(
      [],
    );
    const [draftNode, setDraftNode] = useState<NodeObject | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [draggingStage, setDraggingStage] = useState(false);

    const stageConfig = useAppSelector(selectConfig);
    const toolType = useAppSelector(selectToolType);
    const selectedNodesIds = useAppSelector(selectSelectedNodesIds);

    const userId = useAppSelector(selectMyUser);

    const ws = useWebSocket();

    const { updatePage } = usePageMutation();

    const dispatch = useAppDispatch();

    const drawingPositionRef = useRef<DrawPosition>({
      start: [0, 0],
      current: [0, 0],
    });
    const backgroundRef = useRef<Konva.Rect>(null);
    const selectRef = useRef<Konva.Rect>(null);

    const cursorStyle = useMemo(() => {
      return getCursorStyle(toolType, draggingStage, drawing);
    }, [toolType, drawing, draggingStage]);

    const stageRect = useMemo(() => {
      return { ...size, ...stageConfig.position };
    }, [stageConfig.position, size]);

    const isHandTool = toolType === 'hand';
    const isSelectTool = toolType === 'select';
    const isSelectRectActive = drawing && isSelectTool;
    const isLayerListening = !isHandTool || drawing;
    const hasSelectedNodes = intersectedNodesIds.length > 0;

    // Required for throttleFn to work
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const throttledSendWSMessage = useCallback(
      throttleFn(ws.send, WS_THROTTLE_MS),
      [ws],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const throttledOnNodesSelect = useCallback(throttleFn(onNodesSelect, 50), [
      onNodesSelect,
    ]);

    useEffect(() => {
      setIntersectedNodesIds(Object.keys(selectedNodesIds));
    }, [selectedNodesIds]);

    useEffect(() => {
      throttledOnNodesSelect(intersectedNodesIds);
    }, [intersectedNodesIds, throttledOnNodesSelect]);

    const handlePageUpdate = useCallback(() => {
      const currentNodes = store.getState().canvas.present.nodes;
      updatePage({ nodes: currentNodes });
    }, [updatePage]);

    const updateBackgroundRectPosition = useCallback(
      (stageRect: IRect, stageScale: number) => {
        if (!backgroundRef.current) {
          return;
        }

        const backgroundRect = backgroundRef.current;

        const { x, y } = getNormalizedInvertedRect(stageRect, stageScale);

        backgroundRect.setPosition({ x, y });
      },
      [backgroundRef],
    );

    const handleSelectDraw = useCallback(
      (childrenNodes: ReturnType<typeof getLayerNodes>, position: Point) => {
        const selectRect = selectRef.current?.getClientRect();

        if (!selectRect) {
          return;
        }

        const nodesIntersectedWithSelectRect = getIntersectingNodes(
          childrenNodes,
          selectRect,
        );

        const nodesIds = nodesIntersectedWithSelectRect.map((node) =>
          node.id(),
        );

        setIntersectedNodesIds(nodesIds);

        if (ws.isConnected && userId) {
          throttledSendWSMessage({
            type: 'user-move',
            data: { id: userId, position },
          });
        }
      },
      [ws.isConnected, userId, selectRef, throttledSendWSMessage],
    );

    const handleCreateNode = useCallback(
      (toolType: NodeType, position: Point) => {
        const node = createNode(toolType, position);

        setDraftNode(node);

        if (ws.isConnected) {
          ws.send({ type: 'draft-add', data: node });
        }
      },
      [ws],
    );

    const handleNodeDraw = useCallback(
      (type: DrawableNodeType, nodeId: string, position: DrawPosition) => {
        setDraftNode((prevNode) => {
          if (!prevNode) return prevNode;

          const drawedNode = drawNodeByType({ node: prevNode, position });

          return drawedNode;
        });

        if (ws.isConnected && userId) {
          throttledSendWSMessage({
            type: 'draft-draw',
            data: { userId, nodeId, type, position },
          });
        }
      },
      [ws, userId, throttledSendWSMessage],
    );

    const handleDraftNodeEnd = useCallback(
      (node: NodeObject) => {
        const shouldResetToolType = node.type !== 'draw';
        const nodeIsValid = isValidNode(node);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          nodeIsValid &&
            dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }

        nodeIsValid && dispatch(canvasActions.addNodes([node]));

        if (ws.isConnected && nodeIsValid) {
          ws.send({ type: 'draft-end', data: node });
          handlePageUpdate();
        }

        setDraftNode(null);
      },
      [ws, handlePageUpdate, dispatch],
    );

    const updateDrawingPosition = useCallback(
      (current: Point, start?: Point) => {
        drawingPositionRef.current.current = current;

        if (start) {
          drawingPositionRef.current.start = start;
        }
      },
      [],
    );

    const handlePointerDown = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        if (event.evt.button !== 0 || toolType === 'hand') {
          return;
        }

        const stage = event.target.getStage();

        const clickedOnEmpty = event.target === stage;

        if (!clickedOnEmpty) {
          if (!hasSelectedNodes) {
            event.evt.stopPropagation();
          }
          return;
        }

        event.evt.stopPropagation();

        const currentPoint = getRelativePointerPosition(stage);

        updateDrawingPosition(currentPoint, currentPoint);

        if (toolType !== 'text') {
          setDrawing(true);
        }

        if (toolType !== 'select') {
          handleCreateNode(toolType, currentPoint);
        }

        if (hasSelectedNodes) {
          setIntersectedNodesIds([]);
        }
      },
      [toolType, hasSelectedNodes, handleCreateNode, updateDrawingPosition],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        const stage = event.target.getStage();

        if (!stage || !drawing || toolType === 'hand' || toolType === 'text') {
          return;
        }

        const currentPoint = getRelativePointerPosition(stage);

        updateDrawingPosition(currentPoint);

        if (toolType === 'select') {
          const layer = getMainLayer(stage);
          const children = getLayerNodes(layer);

          return handleSelectDraw(children, currentPoint);
        }

        if (draftNode?.nodeProps.id) {
          handleNodeDraw(
            toolType,
            draftNode.nodeProps.id,
            drawingPositionRef.current,
          );
        }
      },
      [
        draftNode?.nodeProps.id,
        drawing,
        toolType,
        handleNodeDraw,
        handleSelectDraw,
        updateDrawingPosition,
      ],
    );

    const handlePointerUp = useCallback(() => {
      drawing && setDrawing(false);

      if (isSelectTool && drawing) {
        return dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
      }

      if (draftNode && draftNode.type !== 'text') {
        handleDraftNodeEnd(draftNode);
      }
    }, [
      drawing,
      draftNode,
      intersectedNodesIds,
      isSelectTool,
      dispatch,
      handleDraftNodeEnd,
    ]);

    const zoomStageRelativeToPointerPosition = useCallback(
      (stage: Konva.Stage, deltaY: number) => {
        const { position, scale } = calculateStageZoom(
          stage.scaleX(),
          stage.getRelativePointerPosition(),
          stage.getPosition(),
          deltaY,
        );

        if (!isScaleOutOfRange(scale)) {
          dispatch(canvasActions.setStageConfig({ scale, position }));
        }
      },
      [dispatch],
    );

    const handleOnWheel = useCallback(
      (event: KonvaEventObject<WheelEvent>) => {
        const stage = event.target.getStage();

        if (event.evt.ctrlKey && stage) {
          event.evt.preventDefault();
          zoomStageRelativeToPointerPosition(stage, event.evt.deltaY);
        }
      },
      [zoomStageRelativeToPointerPosition],
    );

    const handleStageDragStart = useCallback(() => {
      setDraggingStage(true);
    }, []);

    const handleStageDragMove = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target !== event.target.getStage()) {
          return;
        }

        const stage = event.target;

        const stageRect = { ...stage.getPosition(), ...stage.getSize() };

        updateBackgroundRectPosition(stageRect, stage.scaleX());
      },
      [updateBackgroundRectPosition],
    );

    const handleStageDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target.getStage() !== event.target) {
          return;
        }

        const stage = event.target;
        const position = stage.getPosition();

        dispatch(canvasActions.setStageConfig({ position }));
        setDraggingStage(false);
      },
      [dispatch],
    );

    const handleOnContextMenu = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        if (draftNode) {
          event.evt.preventDefault();
          event.evt.stopPropagation();
        }
      },
      [draftNode],
    );

    const handleNodesChange = useCallback(
      (nodes: NodeObject[]) => {
        dispatch(canvasActions.updateNodes(nodes));

        if (ws.isConnected) {
          ws.send({ type: 'nodes-update', data: nodes });

          handlePageUpdate();
        }
      },
      [ws, handlePageUpdate, dispatch],
    );

    const handleNodePress = useCallback(
      (nodeId: string) => {
        if (isSelectTool) {
          dispatch(canvasActions.setSelectedNodesIds([nodeId]));
        }
      },
      [isSelectTool, dispatch],
    );

    return (
      <Stage
        ref={ref}
        tabIndex={0}
        {...stageRect}
        scale={{ x: stageConfig.scale, y: stageConfig.scale }}
        style={{ cursor: cursorStyle, touchAction: 'none' }}
        draggable={isHandTool}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleOnWheel}
        onDragStart={handleStageDragStart}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
        onContextMenu={handleOnContextMenu}
      >
        <Layer listening={isLayerListening}>
          <BackgroundLayer
            ref={backgroundRef}
            rect={stageRect}
            scale={stageConfig.scale}
          />
          {ws.isConnected && (
            <Suspense>
              <CollaborationLayer
                stageRef={ref}
                isDrawing={drawing}
                stageScale={stageConfig.scale}
              />
            </Suspense>
          )}
          <NodesLayer
            selectedNodesIds={!isHandTool ? intersectedNodesIds : []}
            stageScale={stageConfig.scale}
            onNodePress={handleNodePress}
            onNodesChange={handleNodesChange}
          />
          {draftNode && (
            <DraftNode
              node={draftNode}
              stageScale={stageConfig.scale}
              onDraftEnd={handleDraftNodeEnd}
            />
          )}
          {isSelectRectActive && (
            <SelectRect ref={selectRef} position={drawingPositionRef.current} />
          )}
        </Layer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
