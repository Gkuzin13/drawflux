import { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { type WSMessage, WSMessageUtil } from 'shared';
import {
  BASE_WS_URL,
  BASE_WS_URL_DEV,
  IS_PROD,
  PAGE_URL_SEARCH_PARAM_KEY,
} from '@/constants/app';
import { useAppDispatch } from '@/stores/hooks';
import { historyActions } from '@/stores/reducers/history';
import { canvasActions } from '@/stores/slices/canvas';
import { collaborationActions } from '@/stores/slices/collaboration';
import { urlSearchParam } from '@/utils/url';
import { useModal } from './modal';
import { useNotifications } from './notifications';
import useUrlSearchParams from '@/hooks/useUrlSearchParams/useUrlSearchParams';
import { createContext } from './createContext';

type WebSocketContextValue = {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  send: (message: WSMessage) => void;
};

type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

const serverErrorCodes = [1011];
const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;

let attemptedConnection = false;

export const [WebSocketContext, useWebSocket] =
  createContext<WebSocketContextValue>('WebSocket');

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>('idle');

  const params = useUrlSearchParams();

  const dispatch = useAppDispatch();

  const modal = useModal();
  const notifications = useNotifications();

  useEffect(() => {
    const pageId = params[PAGE_URL_SEARCH_PARAM_KEY];

    if (attemptedConnection || !pageId) {
      return;
    }

    const url = urlSearchParam.set(
      'id',
      pageId,
      `${wsBaseUrl}/${PAGE_URL_SEARCH_PARAM_KEY}`,
    );

    const webSocket = new WebSocket(url);

    const onMessage = (event: MessageEvent) => {
      const message = WSMessageUtil.deserialize(event.data);

      if (message?.type === 'room-joined') {
        notifications.add({
          title: 'Live collaboration',
          description: 'You are connected',
          type: 'success',
        });

        dispatch(
          collaborationActions.init({
            userId: message.data.userId,
            users: message.data.users,
          }),
        );
        dispatch(canvasActions.setNodes(message.data.nodes));
        dispatch(historyActions.reset());
      }
    };

    const onOpen = () => {
      setStatus('connected');
      setWebSocket(webSocket);
    };

    const onClose = (event: CloseEvent) => {
      setStatus('disconnected');

      if (serverErrorCodes.includes(event.code)) {
        modal.open({ title: 'Error', description: event.reason });
      } else {
        modal.open({
          title: 'Live collaboration',
          description: 'Disconnected',
        });
      }
    };

    const onError = () => {
      notifications.add({
        title: 'Connection',
        description: 'Something went wrong',
        type: 'error',
      });
      setStatus('disconnected');
    };

    webSocket.addEventListener('message', onMessage);
    webSocket.addEventListener('open', onOpen);
    webSocket.addEventListener('close', onClose);
    webSocket.addEventListener('error', onError);

    attemptedConnection = true;
  }, [modal, params, notifications, dispatch]);

  const send = useCallback(
    (message: WSMessage) => {
      if (webSocket && webSocket.readyState === webSocket.OPEN) {
        const serializedMessage = WSMessageUtil.serialize(message);
        serializedMessage && webSocket.send(serializedMessage);
      }
    },
    [webSocket],
  );

  return (
    <WebSocketContext.Provider
      value={{
        connection: webSocket,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        send,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
