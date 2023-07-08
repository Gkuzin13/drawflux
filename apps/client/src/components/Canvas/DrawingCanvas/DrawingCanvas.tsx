import type Konva from 'konva';
import type { KonvaEventObject, NodeConfig } from 'konva/lib/Node';
import {
  type PropsWithRef,
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useRef,
  lazy,
  Suspense,
  useEffect,
} from 'react';
import { Layer, Stage } from 'react-konva';
import type {
  NodeObject,
  Point,
  StageConfig,
  UpdatePageRequestBody,
  UpdatePageResponse,
  WSMessage,
} from 'shared';
import { CURSOR } from '@/constants/cursor';
import { NODES_LAYER_INDEX } from '@/constants/shape';
import { useNotifications } from '@/contexts/notifications';
import { useWebSocket } from '@/contexts/websocket';
import useFetch from '@/hooks/useFetch';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { selectCollaboration } from '@/stores/slices/collaboration';
import { store } from '@/stores/store';
import { createNode } from '@/utils/node';
import { getNormalizedInvertedRect } from '@/utils/position';
import { sendMessage, sendThrottledMessage } from '@/utils/websocket';
import BackgroundRect from '../BackgroundRect';
import DraftNode from '../Node/DraftNode';
import Nodes from '../Nodes';
import SelectRect from '../SelectRect';
import { drawTypes } from './helpers/draw';
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

const CollabLayer = lazy(() => import('../Collaboration/CollabLayer'));

const initialDrawingPosition = {
  start: [0, 0] as Point,
  current: [0, 0] as Point,
};

const DrawingCanvas = forwardRef<Konva.Stage, Props>(
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
    const [draggingStage, setDraggingStage] = useState(false);

    const { stageConfig, toolType, nodes } = useAppSelector(selectCanvas);
    const { userId } = useAppSelector(selectCollaboration);

    const ws = useWebSocket();
    const [{ error }, updatePage] = useFetch<
      UpdatePageResponse,
      UpdatePageRequestBody
    >(`/p/${ws?.pageId}`, { method: 'PATCH' }, { skip: true });

    const dispatch = useAppDispatch();

    const drawingPositionRef = useRef(initialDrawingPosition);
    const selectRectRef = useRef<Konva.Rect>(null);
    const backgroundRectRef = useRef<Konva.Rect>(null);

    const { addNotification } = useNotifications();

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

    const isStageDraggable = toolType === 'hand';
    const isSelectRectActive = drawing && toolType === 'select';
    const isNodesLayerActive = !drawing || toolType === 'hand';

    useEffect(() => {
      if (error) {
        addNotification({
          title: 'Error',
          description: 'Failed to update the drawing',
          type: 'error',
        });
      }
    }, [error, addNotification]);

    const handleDraftEnd = useCallback(
      (node: NodeObject) => {
        const shouldResetToolType = toolType !== 'draw';

        if (shouldResetToolType) {
          dispatch(canvasActions.setToolType('select'));
          dispatch(canvasActions.setSelectedNodesIds([node.nodeProps.id]));
        }

        setDraftNode(null);

        if (node.type === 'text' && !node.text) {
          return;
        }

        if (node.type === 'arrow' && !node.nodeProps.points) {
          return;
        }

        dispatch(canvasActions.addNodes([node]));

        if (ws?.isConnected && ws.pageId) {
          const nodeAddMessage: WSMessage = {
            type: 'nodes-add',
            data: { nodes: [node] },
          };

          const draftEndMessage: WSMessage = {
            type: 'draft-end',
            data: { id: node.nodeProps.id },
          };

          sendMessage(ws.connection, nodeAddMessage);
          sendMessage(ws.connection, draftEndMessage);

          const currentNodes = store.getState().canvas.present.nodes;
          updatePage({ nodes: [...currentNodes, node] });
        }
      },
      [ws, toolType, updatePage, dispatch],
    );

    const handleSelectDraw = useCallback(
      (stage: Konva.Stage) => {
        if (!selectRectRef.current) {
          return;
        }

        const layer = stage.getLayers()[NODES_LAYER_INDEX];
        const selectClientRect = selectRectRef.current.getClientRect();

        const nodesIntersectedWithSelectRect = getNodesIntersectingWithRect(
          layer,
          nodes,
          selectClientRect,
        );

        onNodesIntersection(
          nodesIntersectedWithSelectRect.map((node) => node.id()),
        );
      },
      [selectRectRef, nodes, onNodesIntersection],
    );

    const handlePointerPress = useCallback(
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

        drawingPositionRef.current.start = currentPoint;

        switch (toolType) {
          case 'hand':
            return;
          case 'select':
            setDrawing(true);
            drawingPositionRef.current.current = currentPoint;
            break;
          case 'text':
            {
              const node = createNode(toolType, currentPoint);

              setDraftNode(node);

              if (ws?.isConnected) {
                const message: WSMessage = {
                  type: 'draft-add',
                  data: { node },
                };

                sendMessage(ws.connection, message);
              }
            }
            break;
          default: {
            setDrawing(true);
            drawingPositionRef.current.current = currentPoint;

            const node = createNode(toolType, currentPoint);

            setDraftNode(node);

            if (ws?.isConnected) {
              const message: WSMessage = {
                type: 'draft-add',
                data: { node },
              };

              sendMessage(ws.connection, message);
            }
            break;
          }
        }

        if (Object.keys(intersectedNodesIds).length) {
          onNodesIntersection([]);
        }
      },
      [toolType, intersectedNodesIds, ws, onNodesIntersection],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
        const stage = event.target.getStage();

        if (!stage || !drawing || toolType === 'hand' || toolType === 'text') {
          return;
        }

        const { x, y } = stage.getRelativePointerPosition();

        const currentPoint: Point = [x, y];

        if (toolType === 'select') {
          drawingPositionRef.current.current = currentPoint;
          handleSelectDraw(stage);

          if (ws?.isConnected && userId) {
            const message: WSMessage = {
              type: 'user-move',
              data: { id: userId, position: currentPoint },
            };
            sendThrottledMessage(ws.connection, message);
          }

          return;
        }

        if (draftNode?.nodeProps.id) {
          setDraftNode((prevNode) => {
            if (!prevNode) return prevNode;

            const drawFn = drawTypes[toolType];

            return drawFn(
              prevNode,
              drawingPositionRef.current.start,
              currentPoint,
            );
          });

          if (ws?.isConnected && userId) {
            const message: WSMessage = {
              type: 'draft-draw',
              data: {
                userId,
                nodeId: draftNode.nodeProps.id,
                type: toolType,
                position: {
                  start: drawingPositionRef.current.start,
                  current: currentPoint,
                },
              },
            };
            sendThrottledMessage(ws.connection, message);
          }
        }
      },
      [
        draftNode?.nodeProps.id,
        drawing,
        toolType,
        ws,
        userId,
        handleSelectDraw,
      ],
    );

    const handlePointerMoveEnd = useCallback(() => {
      setDrawing(false);

      if (toolType === 'select') {
        dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
        return;
      }

      if (draftNode) {
        handleDraftEnd(draftNode);
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

    const handleStageDragStart = useCallback(() => {
      setDraggingStage(true);
    }, []);

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

    const handleNodesChange = useCallback(
      (nodes: NodeObject[] | NodeObject) => {
        const updatedNodes = Array.isArray(nodes) ? nodes : [nodes];

        dispatch(canvasActions.updateNodes(updatedNodes));

        if (ws?.isConnected && ws?.pageId) {
          const message: WSMessage = {
            type: 'nodes-update',
            data: { nodes: updatedNodes },
          };

          sendMessage(ws.connection, message);

          const currentNodes = store.getState().canvas.present.nodes;
          updatePage({ nodes: currentNodes });
        }
      },
      [ws, updatePage, dispatch],
    );

    return (
      <Stage
        ref={ref}
        {...config}
        tabIndex={0}
        style={{ ...containerStyle, cursor: cursorStyle }}
        draggable={isStageDraggable}
        onMouseDown={handlePointerPress}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerMoveEnd}
        onTouchStart={handlePointerPress}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerMoveEnd}
        onWheel={handleStageOnWheel}
        onDragStart={handleStageDragStart}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
      >
        <Layer listening={false}>
          <BackgroundRect
            ref={backgroundRectRef}
            stageRef={ref}
            stageConfig={stageConfig}
          />

          {ws?.isConnected && (
            <Suspense>
              <CollabLayer
                isDrawing={drawing}
                stageScale={stageConfig.scale}
                stageRef={ref}
              />
            </Suspense>
          )}
          {isSelectRectActive && (
            <SelectRect
              ref={selectRectRef}
              position={drawingPositionRef.current}
            />
          )}
          {draftNode && (
            <DraftNode node={draftNode} onDraftEnd={handleDraftEnd} />
          )}
        </Layer>
        <Layer listening={isNodesLayerActive}>
          <Nodes
            selectedNodesIds={intersectedNodesIds}
            onNodesChange={handleNodesChange}
          />
        </Layer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
