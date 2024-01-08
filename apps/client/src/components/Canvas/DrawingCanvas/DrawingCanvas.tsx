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
import { Stage } from 'react-konva';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectSelectedNodesIds,
  selectToolType,
} from '@/services/canvas/slice';
import { selectThisUser } from '@/services/collaboration/slice';
import { createNode } from '@/utils/node';
import BackgroundLayer from '../Layers/BackgroundLayer';
import {
  getCursorStyle,
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getRelativePointerPosition,
} from './helpers/stage';
import useRefValue from '@/hooks/useRefValue/useRefValue';
import { calculateStageZoomRelativeToPoint } from './helpers/zoom';
import { throttleFn } from '@/utils/timed';
import useDrafts from '@/hooks/useDrafts';
import NodesLayer from '../Layers/NodesLayer';
import SelectRect from '../SelectRect';
import MainLayer from './MainLayer';
import Drafts from '../Node/Drafts';
import { getNormalizedInvertedRect } from '@/utils/position';
import type { DrawPosition } from './helpers/draw';
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
    const thisUser = useAppSelector(selectThisUser);

    const ws = useWebSocket();

    const dispatch = useAppDispatch();

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
        if (!selectRef.current) return;

        const selectRect = selectRef.current.getClientRect();

        const nodesIntersectedWithSelectRect = getIntersectingNodes(
          childrenNodes,
          selectRect,
        );

        const nodesIds = nodesIntersectedWithSelectRect.map((node) =>
          node.id(),
        );

        setIntersectedNodesIds(nodesIds);

        if (ws.isConnected && thisUser) {
          ws.send({ type: 'user-move', data: { id: thisUser.id, position } });
        }
      },
      [ws, thisUser, selectRef],
    );

    const broadcastPointerPosition = useCallback(
      (stage: Konva.Stage) => {
        if (ws.isConnected && thisUser) {
          const position = getRelativePointerPosition(stage);
          ws.send(
            { type: 'user-move', data: { id: thisUser.id, position } },
            true,
          );
        }
      },
      [ws, thisUser],
    );

    const handleDraftCreate = useCallback(
      (toolType: NodeType, position: Point) => {
        const node = createNode(toolType, position);

        setDrafts({ type: 'create', payload: { node } });
        setActiveDraftId(node.nodeProps.id);

        if (ws.isConnected) {
          ws.send({ type: 'draft-create', data: { node } });
        }
      },
      [ws, setActiveDraftId, setDrafts],
    );

    const handleDraftDraw = useCallback(
      (position: DrawPosition) => {
        if (!activeDraftId.current) return;

        const nodeId = activeDraftId.current;

        setDrafts({ type: 'draw', payload: { position, nodeId } });

        if (ws.isConnected && thisUser) {
          ws.send(
            {
              type: 'draft-draw',
              data: { userId: thisUser.id, position, nodeId },
            },
            true,
          );
        }
      },
      [ws, thisUser, activeDraftId, setDrafts],
    );

    const handleDraftTextChange = useCallback(
      (node: NodeObject) => {
        if (ws.isConnected && thisUser) {
          ws.send({
            type: 'draft-update',
            data: { node, userId: thisUser.id },
          });
        }
      },
      [ws, thisUser],
    );

    const handleDraftDelete = useCallback(
      (node: NodeObject) => {
        if (!drawing) {
          setDrafts({ type: 'finish', payload: { nodeId: node.nodeProps.id } });
        }
      },
      [drawing, setDrafts],
    );

    const handleDraftFinish = useCallback(
      (node: NodeObject) => {
        const isNodeSavable = node.type !== 'laser';
        const shouldKeepDraft = node.type === 'laser';
        const shouldResetToolType =
          node.type !== 'draw' && node.type !== 'laser';

        setDrafts({
          type: 'finish',
          payload: { nodeId: node.nodeProps.id, keep: shouldKeepDraft },
        });

        setActiveDraftId(null);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }

        if (isNodeSavable) {
          dispatch(canvasActions.addNodes([node]));
        }

        if (ws.isConnected && thisUser) {
          ws.send({
            type: 'draft-finish',
            data: { node, userId: thisUser.id, keep: shouldKeepDraft },
          });
        }
      },
      [ws, thisUser, dispatch, setDrafts, setActiveDraftId],
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

        const pointerPosition = getRelativePointerPosition(stage);

        setDrawingPosition({
          start: pointerPosition,
          current: pointerPosition,
        });

        if (toolType !== 'text') {
          setDrawing(true);
        }

        if (toolType !== 'select') {
          handleDraftCreate(toolType, pointerPosition);
        }

        if (hasSelectedNodes) {
          setIntersectedNodesIds([]);
        }
      },
      [
        toolType,
        hasSelectedNodes,
        handleDraftCreate,
        setDrawingPosition,
        handleNodePress,
      ],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        const stage = event.target.getStage();

        if (!stage || toolType === 'hand') {
          return;
        }

        const pointerPosition = getRelativePointerPosition(stage);

        if (!drawing) {
          broadcastPointerPosition(stage);
          return;
        }

        setDrawingPosition((prevPosition) => {
          return { start: prevPosition.start, current: pointerPosition };
        });

        if (toolType === 'select') {
          const layer = getMainLayer(stage);
          const children = getLayerNodes(layer);

          return handleSelectDraw(children, pointerPosition);
        }

        handleDraftDraw(drawingPosition.current);
      },
      [
        drawing,
        toolType,
        drawingPosition,
        broadcastPointerPosition,
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
        const pointerPosition = stage.getPointerPosition() || { x: 0, y: 0 };
        const stagePosition = stage.position();
        const stageScale = stage.scaleX();

        const updatedStageConfig = calculateStageZoomRelativeToPoint(
          stageScale,
          pointerPosition,
          stagePosition,
          deltaY > 0 ? -1 : 1,
        );

        dispatch(canvasActions.setStageConfig(updatedStageConfig));
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
          broadcastPointerPosition(event.target.getStage() as Konva.Stage);
          return;
        }

        const stage = event.target;
        const stageRect = { ...stage.getPosition(), ...stage.getSize() };

        updateBackgroundRectPosition(stageRect, stage.scaleX());
      },
      [broadcastPointerPosition, updateBackgroundRectPosition],
    );

    const handleStageDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        if (event.target.getStage() !== event.target) {
          return;
        }

        const position = event.target.getPosition();

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
      },
      [dispatch],
    );

    const handleNodeTextChange = useCallback(
      (node: NodeObject) => {
        if (ws.isConnected) {
          ws.send({ type: 'nodes-update', data: [node] });
        }
      },
      [ws],
    );

    const handleLibraryItemDrop = useCallback(
      (nodes: NodeObject[]) => {
        dispatch(canvasActions.addNodes(nodes, { selectNodes: true }));
        dispatch(canvasActions.setToolType('select'));
      },
      [dispatch],
    );

    const handleLibraryItemDragOver = useCallback(
      (position: Point) => {
        if (ws.isConnected && thisUser) {
          ws.send(
            { type: 'user-move', data: { id: thisUser.id, position } },
            true,
          );
        }
      },
      [ws, thisUser],
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
        <MainLayer
          listening={isLayerListening}
          onLibraryItemDrop={handleLibraryItemDrop}
          onLibraryItemDragOver={handleLibraryItemDragOver}
        >
          <BackgroundLayer
            ref={backgroundRef}
            rect={stageRect}
            scale={stageConfig.scale}
          />
          <NodesLayer
            selectedNodesIds={!isHandTool ? intersectedNodesIds : []}
            stageScale={stageConfig.scale}
            onNodesChange={handleNodesChange}
            onTextChange={handleNodeTextChange}
          />
          <Drafts
            drafts={drafts}
            stageScale={stageConfig.scale}
            onNodeChange={handleDraftFinish}
            onTextChange={handleDraftTextChange}
            onNodeDelete={handleDraftDelete}
          />
          {ws.isConnected && (
            <Suspense>
              <CollaborationLayer stageScale={stageConfig.scale} />
            </Suspense>
          )}
          {isSelectRectActive && (
            <SelectRect ref={selectRef} position={drawingPosition.current} />
          )}
        </MainLayer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
