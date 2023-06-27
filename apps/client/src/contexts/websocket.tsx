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
import { shareActions } from '@/stores/slices/share';
import { urlSearchParam } from '@/utils/url';
import { useModal } from './modal';

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

export const WebSocketContext = createContext<WSContextValue | null>(null);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);
  const initialStatus = pageId ? 'connecting' : 'idle';

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>(initialStatus);

  const dispatch = useAppDispatch();

  const modal = useModal();

  useEffect(() => {
    if (attemptedConnection || !pageId) {
      return;
    }

    attemptedConnection = true;

    const webSocket = new WebSocket(`${wsBaseUrl}/page&id=${pageId}`);

    const onMessage = (event: MessageEvent) => {
      const message = WSMessageUtil.deserialize(event.data);

      if (message?.type === 'room-joined') {
        dispatch(
          shareActions.init({
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
        modal.open('Disconnected', event.reason);
      }
    };

    const onError = () => {
      setStatus('disconnected');
      modal.open('Error', 'Something went wrong');
    };

    webSocket.onopen = onOpen;
    webSocket.onclose = onClose;
    webSocket.onerror = onError;
    webSocket.onmessage = onMessage;

    return () => {
      setStatus(initialStatus);
      setWebSocket(null);
    };
  }, [initialStatus, modal, pageId, dispatch]);

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
