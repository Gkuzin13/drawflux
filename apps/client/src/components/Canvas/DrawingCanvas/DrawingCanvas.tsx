import React, {
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
import { Layer, Stage } from 'react-konva';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector, useAppStore } from '@/stores/hooks';
import {
  canvasActions,
  selectConfig,
  selectSelectedNodeIds,
  selectToolType,
} from '@/services/canvas/slice';
import { selectThisUser } from '@/services/collaboration/slice';
import {
  createNode,
  duplicateNodesAtPosition,
  isValidNode,
} from '@/utils/node';
import BackgroundLayer from './BackgroundLayer';
import {
  getCanvas,
  getIntersectingNodes,
  getLayerNodes,
  getMainLayer,
  getRelativePointerPosition,
  getUnregisteredPointerPosition,
} from './helpers/stage';
import useRefValue from '@/hooks/useRefValue/useRefValue';
import { calculateStageZoomRelativeToPoint } from './helpers/zoom';
import useThrottledFn from '@/hooks/useThrottledFn';
import useDrafts from '@/hooks/useDrafts';
import useEvent from '@/hooks/useEvent/useEvent';
import NodesLayer from './NodesLayer';
import SelectRect from '../SelectRect';
import Drafts from '../Node/Drafts';
import useSharedRef from '@/hooks/useSharedRef';
import { resetCursor, setCursor, setCursorByToolType } from './helpers/cursor';
import { ARROW_TRANSFORMER, TEXT } from '@/constants/shape';
import { safeJSONParse } from '@/utils/object';
import { LIBRARY } from '@/constants/panels';
import type { DrawPosition } from './helpers/draw';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { NodeObject, NodeType, Point } from 'shared';
import type { LibraryItem } from '@/constants/app';

const CollaborationLayer = lazy(
  () => import('@/components/Canvas/DrawingCanvas/CollaborationLayer'),
);

type Props = {
  width: number;
  height: number;
  onNodesSelect: (nodesIds: string[]) => void;
};

const initialDrawingPosition: DrawPosition = { start: [0, 0], current: [0, 0] };

const DrawingCanvas = forwardRef<Konva.Stage, Props>(
  ({ width, height, onNodesSelect }, forwardedRef) => {
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [drawing, setDrawing] = useState(false);

    const [drafts, setDrafts] = useDrafts();

    const store = useAppStore();
    const stageConfig = useAppSelector(selectConfig);
    const toolType = useAppSelector(selectToolType);
    const storedSelectedNodeIds = useAppSelector(selectSelectedNodeIds);
    const thisUser = useAppSelector(selectThisUser);
    const ws = useWebSocket();

    const [drawingPosition, setDrawingPosition] = useRefValue(
      initialDrawingPosition,
    );

    const selectRectRef = useRef<Konva.Rect>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const sharedStageRef = useSharedRef(stageRef, forwardedRef);

    const dispatch = useAppDispatch();

    const stageRect = useMemo(() => {
      return { width, height, ...stageConfig.position };
    }, [stageConfig.position, width, height]);

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

    /**
     * sets initial cursor
     */
    useEffect(() => {
      const { toolType } = store.getState().canvas.present;
      setCursorByToolType(stageRef.current, toolType);
    }, [store]);

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

    const handleDraftCreate = useCallback(
      (toolType: NodeType, position: Point) => {
        const shouldResetToolType = toolType === 'text';

        const node = createNode(toolType, position);

        setDrafts({ type: 'create', payload: { node } });
        setEditingNodeId(node.nodeProps.id);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          resetCursor(stageRef.current);
        }

        if (ws.isConnected) {
          ws.send({ type: 'draft-create', data: { node } });
        }
      },
      [ws, dispatch, setDrafts],
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
        const isLaserType = node.type === 'laser';
        const isNodeSavable = !isLaserType;
        const shouldKeepDraft = isLaserType;
        const shouldResetToolType = node.type !== 'draw' && !isLaserType;

        setDrafts({
          type: 'finish',
          payload: { nodeId: node.nodeProps.id, keep: shouldKeepDraft },
        });

        setEditingNodeId(null);

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          resetCursor(stageRef.current);
        }

        if (!isValidNode(node)) {
          return;
        }

        if (isNodeSavable) {
          dispatch(canvasActions.addNodes([node], { selectNodes: true }));
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

        if(editingNodeId) {
          setEditingNodeId(null);
        }
      },
      [
        toolType,
        hasSelectedNodes,
        editingNodeId,
        handleDraftCreate,
        setDrawingPosition,
        handleNodePress,
        dispatch,
      ],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        const stage = event.target.getStage();

        if (!stage) {
          return;
        }

        const pointerPosition = getRelativePointerPosition(stage);

        if (!drawing || toolType === 'text' || toolType === 'hand') {
          if (ws.isConnected && thisUser) {
            ws.send({
              type: 'user-move',
              data: { id: thisUser.id, position: pointerPosition },
            });
          }
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
        ws,
        thisUser,
        drawing,
        toolType,
        drawingPosition,
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
          dispatch(canvasActions.setSelectedNodeIds(selectedNodeIds));
          return;
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
        selectedNodeIds,
        drafts,
        editingNodeId,
        dispatch,
        handleDraftFinish,
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

    const handleDragStart = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        const stage = event.target.getStage();

        if (
          toolType === 'hand' ||
          event.target.name() === ARROW_TRANSFORMER.ANCHOR_NAME
        ) {
          setCursor(stage, 'grabbing');
        } else if (toolType === 'select') {
          setCursor(stage, 'all-scroll');
        }
      },
      [toolType],
    );

    const handleDragMove = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        const stage = event.target.getStage();

        if (!ws.isConnected || !thisUser || !stage) {
          return;
        }

        const position = getRelativePointerPosition(stage);

        if (position) {
          ws.send(
            { type: 'user-move', data: { id: thisUser.id, position } },
            true,
          );
        }
      },
      [ws, thisUser],
    );

    const handleDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        const stage = event.target.getStage();

        if (
          toolType === 'hand' ||
          event.target.name() === ARROW_TRANSFORMER.ANCHOR_NAME
        ) {
          setCursor(stage, 'grab');

          const draggedStage = event.target === stage;

          if (draggedStage) {
            dispatch(
              canvasActions.setStageConfig({ position: stage.getPosition() }),
            );
          }
        } else if (toolType === 'select') {
          resetCursor(stage);
        } else {
          setCursor(stage, 'crosshair');
        }
      },
      [toolType, dispatch],
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
      },
      [toolType, handleDraftCreate],
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

    const handleDrop = useCallback(
      (event: DragEvent) => {
        event.preventDefault();

        if (!event.dataTransfer || !stageRef.current) return;

        const stage = stageRef.current;
        const position = getUnregisteredPointerPosition(event, stage);

        const dataJSON = event.dataTransfer.getData(LIBRARY.dataTransferFormat);
        const libraryItem = safeJSONParse<LibraryItem>(dataJSON);

        if (libraryItem) {
          const duplicatedNodes = duplicateNodesAtPosition(
            libraryItem.elements,
            position,
          );

          dispatch(
            canvasActions.addNodes(duplicatedNodes, { selectNodes: true }),
          );
          dispatch(canvasActions.setToolType('select'));
        }
      },
      [dispatch],
    );

    const handleDragOver = useCallback(
      (event: DragEvent) => {
        event.preventDefault();

        if (!stageRef.current) return;

        const stage = stageRef.current;
        const position = getUnregisteredPointerPosition(event, stage);

        if (ws.isConnected && thisUser) {
          ws.send(
            { type: 'user-move', data: { id: thisUser.id, position } },
            true,
          );
        }
      },
      [ws, thisUser],
    );

    useEvent('drop', handleDrop, getCanvas(stageRef.current));
    useEvent('dragover', handleDragOver, getCanvas(stageRef.current));

    return (
      <Stage
        ref={sharedStageRef}
        tabIndex={0}
        {...stageRect}
        scaleX={stageConfig.scale}
        scaleY={stageConfig.scale}
        style={{ touchAction: 'none' }}
        draggable={isHandTool}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleOnWheel}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onContextMenu={handleOnContextMenu}
        onDblClick={handleDoublePress}
        onDblTap={handleDoublePress}
      >
        <Layer listening={isLayerListening}>
          <BackgroundLayer rect={stageRect} scale={stageConfig.scale} />
          <NodesLayer
            selectedNodeIds={isSelectTool ? selectedNodeIds : []}
            editingNodeId={isSelectTool ? editingNodeId : null}
            stageScale={stageConfig.scale}
            onNodesChange={handleNodesChange}
            onTextChange={handleNodeTextChange}
          />
          {hasDrafts && (
            <Drafts
              drafts={drafts}
              stageScale={stageConfig.scale}
              editingNodeId={isSelectTool ? editingNodeId : null}
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
        </Layer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default memo(DrawingCanvas);
