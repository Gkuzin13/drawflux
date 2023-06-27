import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  BASE_WS_URL,
  BASE_WS_URL_DEV,
  IS_PROD,
  PAGE_URL_SEARCH_PARAM_KEY,
} from '@/constants/app';
import { urlSearchParam } from '@/utils/url';
import { useModal } from './modal';

type WSContextValue = {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  pageId: string | null;
};

type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;
const serverErrorCodes = [1011];
const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);
const initialStatus = pageId ? 'connecting' : 'idle';

let attempedConnection = false;

export const WebSocketContext = createContext<WSContextValue | null>(null);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<WSStatus>(initialStatus);

  const connection = useRef<WebSocket | null>(null);

  const modal = useModal();

  useEffect(() => {
    if (!connection.current) {
      return;
    }

    const onOpen = () => {
      setStatus('connected');
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

    connection.current.addEventListener('open', onOpen);
    connection.current.addEventListener('close', onClose);
    connection.current.addEventListener('error', onError);

    return () => {
      connection.current?.removeEventListener('open', onOpen);
      connection.current?.removeEventListener('close', onClose);
      connection.current?.removeEventListener('error', onError);
    };
  }, [connection, modal]);

  useEffect(() => {
    if (pageId && !attempedConnection) {
      setStatus('connecting');
      connection.current = new WebSocket(`${wsBaseUrl}/page&id=${pageId}`);
      attempedConnection = true;
    }

    return () => {
      setStatus('idle');
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connection: connection.current,
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
