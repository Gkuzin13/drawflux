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
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectSelectedNodesIds,
  selectToolType,
} from '@/stores/slices/canvas';
import { selectMyUser } from '@/stores/slices/collaboration';
import { createNode, isValidNode } from '@/utils/node';
import BackgroundLayer from '../Layers/BackgroundLayer';
import { type DrawPosition } from './helpers/draw';
import {
  getCursorStyle,
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getRelativePointerPosition,
} from './helpers/stage';
import useRefValue from '@/hooks/useRefValue/useRefValue';
import { calculateStageZoom, isScaleOutOfRange } from './helpers/zoom';
import { throttleFn } from '@/utils/timed';
import { WS_THROTTLE_MS } from '@/constants/app';
import usePageMutation from '@/hooks/usePageMutation';
import useDrafts from '@/hooks/useDrafts';
import NodesLayer from '../Layers/NodesLayer';
import SelectRect from '../SelectRect';
import { getNormalizedInvertedRect } from '@/utils/position';
import type { IRect } from 'konva/lib/types';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { NodeObject, NodeType, Point } from 'shared';

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

const initialDrawingPosition: DrawPosition = { start: [0, 0], current: [0, 0] };

const DrawingCanvas = forwardRef<Konva.Stage, Props>(
  ({ size, onNodesSelect }, ref) => {
    const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>(
      [],
    );
    const [drawing, setDrawing] = useState(false);
    const [drafts, setDrafts] = useDrafts();
    const [draggingStage, setDraggingStage] = useState(false);

    const [activeDraftId, setActiveDraftId] = useRefValue<string | null>(null);
    const [drawingPosition, setDrawingPosition] = useRefValue(
      initialDrawingPosition,
    );
    const backgroundRef = useRef<Konva.Rect>(null);
    const selectRef = useRef<Konva.Rect>(null);

    const stageConfig = useAppSelector(selectConfig);
    const toolType = useAppSelector(selectToolType);
    const selectedNodesIds = useAppSelector(selectSelectedNodesIds);
    const userId = useAppSelector(selectMyUser);

    const store = useAppStore();

    const ws = useWebSocket();

    const { updatePage } = usePageMutation();

    const dispatch = useAppDispatch();

    const nodeDrafts = drafts.map(({ node }) => node);

    const cursorStyle = useMemo(() => {
      return getCursorStyle(toolType, draggingStage, drawing);
    }, [toolType, drawing, draggingStage]);

    const stageRect = useMemo(() => {
      return { ...size, ...stageConfig.position };
    }, [stageConfig.position, size]);

    const isHandTool = toolType === 'hand';
    const isSelectTool = toolType === 'select';
    const isSelectRectActive = drawing && isSelectTool;
    const isLayerListening = !isHandTool && !drawing && isSelectTool;
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
    }, [store, updatePage]);

    const updateBackgroundRectPosition = useCallback(
      (stageRect: IRect, stageScale: number) => {
        if (!backgroundRef.current) return;

        const { x, y } = getNormalizedInvertedRect(stageRect, stageScale);

        backgroundRef.current.setPosition({ x, y });
      },
      [backgroundRef],
    );

    const handleSelectDraw = useCallback(
      (childrenNodes: ReturnType<typeof getLayerNodes>, position: Point) => {
        const selectRect = selectRef.current?.getClientRect();

        if (!selectRect) return;

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

    const handleCreateDraft = useCallback(
      (toolType: NodeType, position: Point) => {
        const node = createNode(toolType, position);

        setDrafts({ type: 'add', payload: { node } });
        setActiveDraftId(node.nodeProps.id);

        if (ws.isConnected && userId) {
          ws.send({ type: 'draft-create', data: { node } });
        }
      },
      [ws, userId, setActiveDraftId, setDrafts],
    );

    const handleDraftDraw = useCallback(
      (position: DrawPosition) => {
        if (!activeDraftId.current) return;

        const nodeId = activeDraftId.current;

        setDrafts({ type: 'draw', payload: { position, nodeId } });

        if (ws.isConnected && userId) {
          throttledSendWSMessage({
            type: 'draft-draw',
            data: { userId, position, nodeId },
          });
        }
      },
      [ws, userId, activeDraftId, setDrafts, throttledSendWSMessage],
    );

    const handleDraftFinish = useCallback(
      (node: NodeObject) => {
        const isNodeSavable = node.type !== 'laser';
        const shouldKeepDraft = node.type === 'laser';
        const shouldResetToolType =
          node.type !== 'draw' && node.type !== 'laser';

        setDrafts({
          type: shouldKeepDraft ? 'finish-keep' : 'finish',
          payload: { nodeId: node.nodeProps.id },
        });
        setActiveDraftId(null);

        const nodeIsValid = isValidNode(node);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          nodeIsValid &&
            dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }

        if (isNodeSavable) {
          dispatch(canvasActions.addNodes([node]));
        }

        if (ws.isConnected && userId && nodeIsValid) {
          const messageType = shouldKeepDraft
            ? 'draft-finish-keep'
            : 'draft-finish';

          ws.send({ type: messageType, data: { node, userId } });

          isNodeSavable && handlePageUpdate();
        }
      },
      [ws, userId, handlePageUpdate, dispatch, setDrafts, setActiveDraftId],
    );

    const handleNodePress = useCallback(
      (nodeId: string) => {
        if (isSelectTool) {
          dispatch(canvasActions.setSelectedNodesIds([nodeId]));
        }
      },
      [isSelectTool, dispatch],
    );

    const handlePointerDown = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        if (event.evt.button !== 0 || toolType === 'hand') {
          return;
        }

        const stage = event.target.getStage();

        const clickedOnEmpty = event.target === stage;

        if (!clickedOnEmpty) {
          const nodeId = event.target.id();

          if (nodeId) {
            handleNodePress(nodeId);
          }

          if (!hasSelectedNodes) {
            event.evt.stopPropagation();
          }
          return;
        }

        event.evt.stopPropagation();

        const currentPoint = getRelativePointerPosition(stage);

        setDrawingPosition({ start: currentPoint, current: currentPoint });

        if (toolType !== 'text') {
          setDrawing(true);
        }

        if (toolType !== 'select') {
          handleCreateDraft(toolType, currentPoint);
        }

        if (hasSelectedNodes) {
          setIntersectedNodesIds([]);
        }
      },
      [
        toolType,
        hasSelectedNodes,
        handleCreateDraft,
        setDrawingPosition,
        handleNodePress,
      ],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        const stage = event.target.getStage();

        if (!stage || !drawing || toolType === 'hand' || toolType === 'text') {
          return;
        }

        const currentPoint = getRelativePointerPosition(stage);

        setDrawingPosition((prevPosition) => {
          return { start: prevPosition.start, current: currentPoint };
        });

        if (toolType === 'select') {
          const layer = getMainLayer(stage);
          const children = getLayerNodes(layer);

          return handleSelectDraw(children, currentPoint);
        }

        handleDraftDraw(drawingPosition.current);
      },
      [
        drawing,
        toolType,
        drawingPosition,
        handleDraftDraw,
        handleSelectDraw,
        setDrawingPosition,
      ],
    );

    const handlePointerUp = useCallback(() => {
      drawing && setDrawing(false);

      if (isSelectTool && drawing) {
        return dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
      }

      const draft = drafts.find(
        ({ node }) => node.nodeProps.id === activeDraftId.current,
      );

      if (draft && draft.node.type !== 'text') {
        handleDraftFinish(draft.node);
      }
    }, [
      drawing,
      drafts,
      intersectedNodesIds,
      isSelectTool,
      activeDraftId,
      dispatch,
      handleDraftFinish,
    ]);

    const zoomStageRelativeToPointerPosition = useCallback(
      (stage: Konva.Stage, deltaY: number) => {
        const { position, scale } = calculateStageZoom(
          stage.scaleX(),
          stage.getRelativePointerPosition() || { x: 0, y: 0 },
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
        if (event.target !== event.target.getStage()) return;

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
        if (activeDraftId.current) {
          event.evt.preventDefault();
          event.evt.stopPropagation();
        }
      },
      [activeDraftId],
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

    const handleNodeDelete = useCallback(
      (node: NodeObject) => {
        if (!drawing) {
          setDrafts({ type: 'finish', payload: { nodeId: node.nodeProps.id } });
        }
      },
      [drawing, setDrafts],
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
          <NodesLayer
            selectedNodesIds={!isHandTool ? intersectedNodesIds : []}
            stageScale={stageConfig.scale}
            nodeDrafts={nodeDrafts}
            onNodesChange={handleNodesChange}
            onNodeDraftFinish={handleDraftFinish}
            onNodesDelete={handleNodeDelete}
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
          {isSelectRectActive && (
            <SelectRect ref={selectRef} position={drawingPosition.current} />
          )}
        </Layer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
