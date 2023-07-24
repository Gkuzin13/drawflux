import type Konva from 'konva';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { WSMessage, StageConfig } from 'shared';
import DrawingCanvas from '@/components/Canvas/DrawingCanvas/DrawingCanvas';
import {
  getNodesIntersectingWithRect,
  getPointerRect,
} from '@/components/Canvas/DrawingCanvas/helpers/stage';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Panels from '@/components/Panels/Panels';
import { KEYS } from '@/constants/keys';
import { TOOLS } from '@/constants/panels/tools';
import { NODES_LAYER_INDEX } from '@/constants/shape';
import { useWebSocket } from '@/contexts/websocket';
import useKeyDown from '@/hooks/useKeyDown/useKeyDown';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  type HistoryActionKey,
  historyActions,
} from '@/stores/reducers/history';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import { sendMessage } from '@/utils/websocket';
import * as Styled from './MainLayout.styled';
import usePageMutation from '@/hooks/usePageMutation';
import { store } from '@/stores/store';
import { getAddedNodes } from '@/utils/node';
import useWindowSize from '@/hooks/useWindowSize/useWindowSize';

const MainLayout = () => {
  const [selectedNodesIds, setSelectedNodesIds] = useState<string[]>([]);

  const windowSize = useWindowSize();
  const ws = useWebSocket();
  const { updatePage } = usePageMutation(ws?.pageId ?? '');
  const { stageConfig } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);

  const canvasConfig = useMemo(() => {
    const scale = { x: stageConfig.scale, y: stageConfig.scale };
    return {
      scale,
      ...stageConfig.position,
      ...windowSize,
    };
  }, [stageConfig, windowSize]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, shiftKey, ctrlKey } = event;
      const lowerCaseKey = key.toLowerCase();

      const onCtrlKey = (key: string) => {
        switch (key) {
          case KEYS.A: {
            event.preventDefault();
            dispatch(canvasActions.selectAllNodes());
            break;
          }
          case KEYS.Z: {
            const actionKey: HistoryActionKey = shiftKey ? 'redo' : 'undo';
            const action = historyActions[actionKey];

            dispatch(action());

            if (ws?.isConnected) {
              const message: WSMessage = {
                type: 'history-change',
                data: { action: actionKey },
              };

              sendMessage(ws.connection, message);
            }
            break;
          }
          case KEYS.D: {
            event.preventDefault();

            dispatch(canvasActions.duplicateNodes(selectedNodesIds));

            const currentNodes = store.getState().canvas.present.nodes;

            if (ws?.isConnected) {
              const message: WSMessage = {
                type: 'nodes-add',
                data: getAddedNodes(currentNodes, selectedNodesIds.length),
              };

              sendMessage(ws.connection, message);
              updatePage({ nodes: currentNodes });
            }
            break;
          }
          case KEYS.C: {
            dispatch(canvasActions.copyNodes(selectedNodesIds));
            break;
          }
          case KEYS.V: {
            dispatch(canvasActions.pasteNodes());

            if (ws?.isConnected) {
              const { nodes, selectedNodesIds } =
                store.getState().canvas.present;

              const message: WSMessage = {
                type: 'nodes-add',
                data: getAddedNodes(
                  nodes,
                  Object.keys(selectedNodesIds).length,
                ),
              };

              sendMessage(ws.connection, message);
              updatePage({ nodes });
            }
            break;
          }
        }
      };

      if (ctrlKey) {
        return onCtrlKey(lowerCaseKey);
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-delete',
            data: selectedNodesIds,
          };

          sendMessage(ws.connection, message);

          const currentNodes = store.getState().canvas.present.nodes;
          updatePage({ nodes: currentNodes });
        }
        return;
      }

      const toolTypeObj = TOOLS.find((tool) => tool.key === lowerCaseKey);
      toolTypeObj && dispatch(canvasActions.setToolType(toolTypeObj.value));
    },
    [ws, selectedNodesIds, updatePage, dispatch],
  );

  useKeyDown(stageRef.current?.container(), onKeyDown);

  const handleStageConfigChange = useCallback(
    (config: Partial<StageConfig>) => {
      dispatch(canvasActions.setStageConfig(config));
    },
    [dispatch],
  );

  const handleNodesUpdate = useCallback(() => {
    const currentNodes = store.getState().canvas.present.nodes;
    updatePage({ nodes: currentNodes });
  }, [updatePage]);

  const handleContextMenuOpen = useCallback(
    (open: boolean) => {
      const stage = stageRef.current;

      if (!stage || !open) {
        return;
      }

      const pointerPosition = stage.getPointerPosition();

      if (!pointerPosition) {
        return;
      }

      const layer = stage.getLayers()[NODES_LAYER_INDEX];

      const pointerRect = getPointerRect(pointerPosition, stageConfig.scale);
      const nodesInClickArea = getNodesIntersectingWithRect(layer, pointerRect);

      const multipleNodesSelected = selectedNodesIds.length > 1;
      const clickedOnNodes = Boolean(nodesInClickArea.length);
      const clickedOnSelectedNodes = nodesInClickArea.some((node) =>
        selectedNodesIds.includes(node.id()),
      );

      if (clickedOnNodes && !clickedOnSelectedNodes && !multipleNodesSelected) {
        const nodesIds = nodesInClickArea.map((node) => node.id());
        setSelectedNodesIds(nodesIds);
        dispatch(canvasActions.setSelectedNodesIds(nodesIds));
      }
    },
    [stageConfig.scale, selectedNodesIds, dispatch],
  );

  const handleNodesSelect = useCallback((nodesIds: string[]) => {
    setSelectedNodesIds(nodesIds);
  }, []);

  return (
    <Styled.Container tabIndex={-1}>
      <Panels intersectedNodesIds={selectedNodesIds} stageRef={stageRef} />
      <ContextMenu.Root
        selectedNodesCount={selectedNodesIds.length}
        onContextMenuOpen={handleContextMenuOpen}
      >
        <ContextMenu.Trigger>
          <DrawingCanvas
            ref={stageRef}
            config={canvasConfig}
            onNodesSelect={handleNodesSelect}
            onConfigChange={handleStageConfigChange}
            onNodesUpdate={handleNodesUpdate}
          />
        </ContextMenu.Trigger>
      </ContextMenu.Root>
    </Styled.Container>
  );
};

export default MainLayout;
