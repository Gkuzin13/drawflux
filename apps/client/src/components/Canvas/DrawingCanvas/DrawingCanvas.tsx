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
import type { NodeObject, Point, StageConfig, WSMessage } from 'shared';
import { CURSOR } from '@/constants/cursor';
import { NODES_LAYER_INDEX } from '@/constants/shape';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { selectCollaboration } from '@/stores/slices/collaboration';
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
import { throttleFn } from '@/utils/timed';

type Props = PropsWithRef<{
  config: NodeConfig;
  containerStyle?: React.CSSProperties;
  onConfigChange: (config: Partial<StageConfig>) => void;
  onNodesUpdate: () => void;
  onNodesSelect: (nodesIds: string[]) => void;
}>;

const CollabLayer = lazy(() => import('../Collaboration/CollabLayer'));

const initialDrawingPosition = {
  start: [0, 0] as Point,
  current: [0, 0] as Point,
};

const DrawingCanvas = forwardRef<Konva.Stage, Props>(
  (
    { config, containerStyle, onNodesSelect, onConfigChange, onNodesUpdate },
    ref,
  ) => {
    const [intersectedNodesIds, setIntersectedNodesIds] = useState<string[]>(
      [],
    );
    const [draftNode, setDraftNode] = useState<NodeObject | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [draggingStage, setDraggingStage] = useState(false);

    const { stageConfig, toolType, selectedNodesIds } =
      useAppSelector(selectCanvas);
    const { userId } = useAppSelector(selectCollaboration);

    const ws = useWebSocket();

    const dispatch = useAppDispatch();

    const drawingPositionRef = useRef(initialDrawingPosition);
    const selectRectRef = useRef<Konva.Rect>(null);
    const backgroundRectRef = useRef<Konva.Rect>(null);

    const throttledOnNodesSelect = useRef(
      throttleFn((nodesIds: string[]) => onNodesSelect(nodesIds), 70),
    );

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

    const isHandTool = toolType === 'hand';
    const isSelectRectActive = drawing && toolType === 'select';
    const isNodesLayerActive = !drawing || isHandTool;

    useEffect(() => {
      throttledOnNodesSelect.current(intersectedNodesIds);
    }, [intersectedNodesIds]);

    useEffect(() => {
      const nodesIds = Object.keys(selectedNodesIds);
      setIntersectedNodesIds(nodesIds);
      onNodesSelect(nodesIds);
    }, [selectedNodesIds, onNodesSelect]);

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
          const draftEndMessage: WSMessage = {
            type: 'draft-end',
            data: node,
          };

          sendMessage(ws.connection, draftEndMessage);
          onNodesUpdate();
        }
      },
      [ws, toolType, onNodesUpdate, dispatch],
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
          selectClientRect,
        );

        setIntersectedNodesIds(
          nodesIntersectedWithSelectRect.map((node) => node.id()),
        );
      },
      [selectRectRef],
    );

    const handlePointerDown = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
        if (event.evt.button !== 0) {
          return;
        }

        const stage = event.target.getStage();

        const clickedOnEmpty = event.target === stage;

        const hasSelectedNodes = Object.keys(selectedNodesIds).length > 0;

        if (!clickedOnEmpty) {
          if (!hasSelectedNodes) {
            event.evt.stopPropagation();
          }
          return;
        }
        event.evt.stopPropagation();

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
                  data: node,
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
                data: node,
              };

              sendMessage(ws.connection, message);
            }
            break;
          }
        }

        if (hasSelectedNodes) {
          setIntersectedNodesIds([]);
        }
      },
      [toolType, ws, selectedNodesIds],
    );

    const handlePointerMove = useCallback(
      (event: KonvaEventObject<PointerEvent>) => {
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

    const handlePointerUp = useCallback(() => {
      drawing && setDrawing(false);

      if (toolType === 'select' && drawing) {
        dispatch(canvasActions.setSelectedNodesIds(intersectedNodesIds));
        return;
      }

      if (draftNode && draftNode.type !== 'text') {
        handleDraftEnd(draftNode);
      }
    }, [
      drawing,
      draftNode,
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
      (nodes: NodeObject[] | NodeObject) => {
        const updatedNodes = Array.isArray(nodes) ? nodes : [nodes];

        dispatch(canvasActions.updateNodes(updatedNodes));

        if (ws?.isConnected && ws?.pageId) {
          const message: WSMessage = {
            type: 'nodes-update',
            data: updatedNodes,
          };

          sendMessage(ws.connection, message);
          onNodesUpdate();
        }
      },
      [ws, onNodesUpdate, dispatch],
    );

    const handleNodePress = useCallback(
      (nodeId: string) => {
        if (toolType === 'select') {
          dispatch(canvasActions.setSelectedNodesIds([nodeId]));
        }
      },
      [toolType, dispatch],
    );

    return (
      <Stage
        ref={ref}
        {...config}
        tabIndex={0}
        style={{ ...containerStyle, cursor: cursorStyle, touchAction: 'none' }}
        draggable={isHandTool}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleStageOnWheel}
        onDragStart={handleStageDragStart}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
        onContextMenu={handleOnContextMenu}
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
            selectedNodesIds={!isHandTool ? intersectedNodesIds : []}
            onNodePress={handleNodePress}
            onNodesChange={handleNodesChange}
          />
        </Layer>
      </Stage>
    );
  },
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;
