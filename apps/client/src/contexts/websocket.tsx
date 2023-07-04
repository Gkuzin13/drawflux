import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { WSMessageUtil } from 'shared';
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

type WSContextValue = {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  pageId: string | null;
};

type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

const serverErrorCodes = [1011];
const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;

let attemptedConnection = false;

const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);
const initialStatus = pageId ? 'connecting' : 'idle';

export const WebSocketContext = createContext<WSContextValue | null>(null);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>(initialStatus);

  const dispatch = useAppDispatch();

  const modal = useModal();
  const notifications = useNotifications();

  useEffect(() => {
    if (attemptedConnection || !pageId) {
      return;
    }
    const url = urlSearchParam.set('id', pageId, `${wsBaseUrl}/page`);
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
        modal.open('Error', event.reason);
      } else {
        modal.open('Live collaboration', 'Disconnected');
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
  }, [modal, notifications, dispatch]);

  return (
    <WebSocketContext.Provider
      value={{
        connection: webSocket,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        pageId,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WSContextValue | null => {
  const ctx = useContext(WebSocketContext);

  if (ctx === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return ctx;
};
