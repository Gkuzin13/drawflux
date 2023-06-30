import { useCallback, useEffect } from 'react';
import { type WSMessage } from 'shared';
import { KEYS } from '@/constants/keys';
import { TOOLS, type Tool } from '@/constants/panels/tools';
import { useWebSocket } from '@/contexts/websocket';
import { useAppDispatch } from '@/stores/hooks';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions } from '@/stores/slices/canvas';
import { store } from '@/stores/store';
import { sendMessage } from '@/utils/websocket';

function useKbdShortcuts(
  element: HTMLElement | null,
  selectedNodesIds: string[],
  toolType: Tool['value'],
) {
  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  const dispatchActionsOnCtrlCombo = useCallback(
    (event: KeyboardEvent) => {
      const shiftPressed = event.shiftKey;
      const key = event.key.toLowerCase();

      switch (key) {
        case KEYS.Z: {
          const action = shiftPressed
            ? historyActions.redo
            : historyActions.undo;

          dispatch(action());

          if (ws?.isConnected) {
            const message: WSMessage = {
              type: 'history-change',
              data: { action: shiftPressed ? 'redo' : 'undo' },
            };

            sendMessage(ws.connection, message);
          }
          break;
        }
        case KEYS.D: {
          event.preventDefault();

          dispatch(canvasActions.duplicateNodes(selectedNodesIds));

          if (ws?.isConnected) {
            const message: WSMessage = {
              type: 'nodes-duplicate',
              data: { nodesIds: selectedNodesIds },
            };

            sendMessage(ws.connection, message);
          }
        }
      }
    },
    [selectedNodesIds],
  );

  useEffect(() => {
    if (!element) {
      return;
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;

      if (event.ctrlKey) {
        dispatchActionsOnCtrlCombo(event);
        const currentNodes = store.getState().canvas.present.nodes;

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-set',
            data: { nodes: currentNodes },
          };

          sendMessage(ws.connection, message);
        }
        return;
      }

      if (key === KEYS.DELETE) {
        dispatch(canvasActions.deleteNodes(selectedNodesIds));

        if (ws?.isConnected) {
          const message: WSMessage = {
            type: 'nodes-delete',
            data: { nodesIds: selectedNodesIds },
          };

          sendMessage(ws.connection, message);
        }
        return;
      }

      const toolTypeByKey = TOOLS.find(
        (tool) => tool.key === key.toLowerCase(),
      );

      dispatch(canvasActions.setToolType(toolTypeByKey?.value || 'select'));
    };

    element.addEventListener('keydown', handleKeyUp);

    return () => {
      element.removeEventListener('keydown', handleKeyUp);
    };
  }, [toolType, selectedNodesIds, element]);
}

export default useKbdShortcuts;
