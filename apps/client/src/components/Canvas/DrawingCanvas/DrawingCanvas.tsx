import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  lazy,
  Suspense,
  useMemo,
  useEffect,
  memo,
} from 'react';
import { Stage } from 'react-konva';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectSelectedNodeIds,
  selectToolType,
} from '@/services/canvas/slice';
import { selectThisUser } from '@/services/collaboration/slice';
import { createNode, isValidNode } from '@/utils/node';
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
import useThrottledFn from '@/hooks/useThrottledFn';
import useDrafts from '@/hooks/useDrafts';
import NodesLayer from '../Layers/NodesLayer';
import SelectRect from '../SelectRect';
import MainLayer from './MainLayer';
import Drafts from '../Node/Drafts';
import { TEXT } from '@/constants/shape';
import type { DrawPosition } from './helpers/draw';
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
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [draggingStage, setDraggingStage] = useState(false);

    const [drafts, setDrafts] = useDrafts();

    const [drawingPosition, setDrawingPosition] = useRefValue(
      initialDrawingPosition,
    );

    const stageConfig = useAppSelector(selectConfig);
    const toolType = useAppSelector(selectToolType);
    const storedSelectedNodeIds = useAppSelector(selectSelectedNodeIds);
    const thisUser = useAppSelector(selectThisUser);
    const ws = useWebSocket();

    const selectRectRef = useRef<Konva.Rect>(null);

    const dispatch = useAppDispatch();

    const cursorStyle = useMemo(() => {
      return getCursorStyle(toolType, draggingStage, drawing);
    }, [toolType, drawing, draggingStage]);

    const stageRect = useMemo(() => {
      return { ...size, ...stageConfig.position };
    }, [stageConfig.position, size]);

    const isHandTool = toolType === 'hand';
    const isSelectTool = toolType === 'select';
    const isSelecting = drawing && isSelectTool;
    const isLayerListening = !isHandTool && !drawing && isSelectTool;
    const hasSelectedNodes = selectedNodeIds.length > 0;
    const hasDrafts = drafts.length > 0;

    /**
     * syncs with store state when selected nodes change
     */
    useEffect(() => {
      const nodesIds = Object.keys(storedSelectedNodeIds);
      setSelectedNodeIds(nodesIds);
      onNodesSelect(nodesIds);
    }, [storedSelectedNodeIds, onNodesSelect]);

    const throttledOnNodesSelect = useThrottledFn(onNodesSelect);

    const handleSelectDraw = useCallback(
      (childrenNodes: ReturnType<typeof getLayerNodes>, position: Point) => {
        if (!selectRectRef.current) return;

        const selectRect = selectRectRef.current.getClientRect();

        const nodesIntersectedWithSelectRect = getIntersectingNodes(
          childrenNodes,
          selectRect,
        );

        const nodesIds = nodesIntersectedWithSelectRect.map((node) =>
          node.id(),
        );

        setSelectedNodeIds(nodesIds);
        throttledOnNodesSelect(nodesIds);

        if (ws.isConnected && thisUser) {
          ws.send({ type: 'user-move', data: { id: thisUser.id, position } });
        }
      },
      [ws, thisUser, throttledOnNodesSelect],
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
        setEditingNodeId(node.nodeProps.id);

        if (ws.isConnected) {
          ws.send({ type: 'draft-create', data: { node } });
        }
      },
      [ws, setDrafts],
    );

    const handleDraftDraw = useCallback(
      (position: DrawPosition) => {
        if (!editingNodeId) return;

        const nodeId = editingNodeId;

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
      [ws, thisUser, editingNodeId, setDrafts],
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

        setEditingNodeId(null);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
        }

        if (!isValidNode(node)) {
          return;
        }

        dispatch(canvasActions.setSelectedNodeIds([node.nodeProps.id]));

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
      [ws, thisUser, dispatch, setDrafts],
    );

    const handleNodePress = useCallback(
      (nodeId: string) => {
        if (isSelectTool) {
          dispatch(canvasActions.setSelectedNodeIds([nodeId]));
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

          return;
        }

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
          setSelectedNodeIds([]);
          dispatch(canvasActions.setSelectedNodeIds([]));
        }
      },
      [
        toolType,
        hasSelectedNodes,
        handleDraftCreate,
        setDrawingPosition,
        handleNodePress,
        dispatch,
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

    const handlePointerUp = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        const stage = event.target.getStage();

        if (!stage) {
          return;
        }

        /**
         * [TODO]: temporary fix
         *
         *         pointerup is not being triggered in the parent element
         *
         *         either a bug in radix-ui or Konva, or maybe something else
         *
         *         it is working when the stage size is small
         *         tested with: 500x500 and it is working. window.innerWidth/Height is not
         */
        stage.container().dispatchEvent(new Event(event.type, event.evt));

        setDrawing(false);

        if (isSelecting) {
          const layer = getMainLayer(stage);
          const children = getLayerNodes(layer);
          const pointerPosition = getRelativePointerPosition(stage);

          handleSelectDraw(children, pointerPosition);
          return dispatch(canvasActions.setSelectedNodeIds(selectedNodeIds));
        }

        const draft = drafts.find(
          ({ node }) => node.nodeProps.id === editingNodeId,
        );

        if (draft && draft.node.type !== 'text') {
          handleDraftFinish(draft.node);
        }
      },
      [
        isSelecting,
        drafts,
        selectedNodeIds,
        editingNodeId,
        dispatch,
        handleDraftFinish,
        handleSelectDraw,
      ],
    );

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
      },
      [broadcastPointerPosition],
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
        if (editingNodeId) {
          event.evt.preventDefault();
          event.evt.stopPropagation();
        }
      },
      [editingNodeId],
    );

    const handleDoublePress = useCallback(
      (event: KonvaEventObject<MouseEvent | Event>) => {
        if ('button' in event.evt && event.evt.button !== 0) {
          return;
        }

        const stage = event.target.getStage();
        const clickedOnEmpty = event.target === stage;

        if (!clickedOnEmpty || toolType !== 'select') {
          const element = event.target;
          const clickedOnTextNode =
            element.parent?.attrs.type === TEXT.TRANSFORMER_TYPE;

          if (clickedOnTextNode) {
            const transformer = element.parent as Konva.Transformer;

            setEditingNodeId(transformer.getNode().id());
          }
          return;
        }

        const position = getRelativePointerPosition(stage);

        handleDraftCreate('text', position);
        dispatch(canvasActions.setToolType('text'));
      },
      [toolType, handleDraftCreate, dispatch],
    );

    const handleNodesChange = useCallback(
      (nodes: NodeObject[]) => {
        dispatch(canvasActions.updateNodes(nodes));
        setEditingNodeId(null);
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
        onDblClick={handleDoublePress}
        onDblTap={handleDoublePress}
      >
        <MainLayer
          listening={isLayerListening}
          onLibraryItemDrop={handleLibraryItemDrop}
          onLibraryItemDragOver={handleLibraryItemDragOver}
        >
          <BackgroundLayer rect={stageRect} scale={stageConfig.scale} />
          <NodesLayer
            selectedNodeIds={!isHandTool ? selectedNodeIds : []}
            editingNodeId={!isHandTool ? editingNodeId : null}
            stageScale={stageConfig.scale}
            onNodesChange={handleNodesChange}
            onTextChange={handleNodeTextChange}
          />
          {hasDrafts && (
            <Drafts
              drafts={drafts}
              stageScale={stageConfig.scale}
              editingNodeId={!isHandTool ? editingNodeId : null}
              onNodeChange={handleDraftFinish}
              onTextChange={handleDraftTextChange}
              onNodeDelete={handleDraftDelete}
            />
          )}
          {ws.isConnected && (
            <Suspense>
              <CollaborationLayer stageScale={stageConfig.scale} />
            </Suspense>
          )}
          {isSelecting && (
            <SelectRect
              ref={selectRectRef}
              position={drawingPosition.current}
            />
          )}
        </MainLayer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default memo(DrawingCanvas);
