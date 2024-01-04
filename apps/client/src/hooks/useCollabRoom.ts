import { useEffect } from 'react';
import { useNotifications } from '@/contexts/notifications';
import { useAppDispatch } from '@/stores/hooks';
import { CONSTANTS } from 'shared';
import { urlSearchParam } from '@/utils/url';
import { BASE_WS_URL, BASE_WS_URL_DEV, IS_PROD } from '@/constants/app';
import {
  addCollabActionsListeners,
  subscribeToIncomingCollabMessages,
} from '@/services/collaboration/listeners';
import { canvasActions } from '@/services/canvas/slice';
import api from '@/services/api';
import type { WebSocketContextValue } from '@/contexts/websocket';

const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;

function useCollabRoom(ws: WebSocketContextValue, roomId: string | null) {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!roomId) return;

    const [request, abortController] = api.getPage(roomId);

    request.then(({ page }) => {
      dispatch(canvasActions.setNodes(page.nodes, { broadcast: false }));
    });

    return () => {
      if (abortController.signal) {
        abortController.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const wsUrl = createWSRoomUrl(roomId);

    ws.connect(wsUrl);

    const subscribers = subscribeToIncomingCollabMessages(ws, dispatch);

    return () => {
      subscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [ws, roomId, dispatch]);

  useEffect(() => {
    if (!roomId || !ws.isConnected) {
      return;
    }

    const unsubscribe = dispatch(addCollabActionsListeners(ws, roomId));

    return () => {
      unsubscribe({ cancelActive: true });
    };
  }, [ws, roomId, dispatch]);

  useEffect(() => {
    if (ws.isConnected) {
      addNotification({
        title: 'Live collaboration',
        description: 'You are connected',
        type: 'success',
      });
    }
  }, [ws.isConnected, addNotification]);
}

export function createWSRoomUrl(roomId: string) {
  return urlSearchParam.set(
    'id',
    roomId,
    `${wsBaseUrl}/${CONSTANTS.COLLAB_ROOM_URL_PARAM}`,
  );
}

export default useCollabRoom;
