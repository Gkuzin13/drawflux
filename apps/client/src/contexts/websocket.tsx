import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { urlSearchParam } from '@/utils/url';

type WSContextValue = {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  pageId: string | null;
};

type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

export const WebSocketContext = createContext<WSContextValue | null>(null);

const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);
const initialStatus = pageId ? 'connecting' : 'idle';

let attempedConnection = false;

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<WSStatus>(initialStatus);

  const connection = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!connection.current) {
      return;
    }

    const onOpen = () => {
      setStatus('connected');
    };

    const onClose = () => {
      setStatus('disconnected');
    };

    const onError = () => {
      setStatus('disconnected');
    };

    connection.current.addEventListener('open', onOpen);
    connection.current.addEventListener('close', onClose);
    connection.current.addEventListener('error', onError);

    return () => {
      connection.current?.removeEventListener('open', onOpen);
      connection.current?.removeEventListener('close', onClose);
      connection.current?.removeEventListener('error', onError);
    };
  }, [connection]);

  useEffect(() => {
    if (pageId && !attempedConnection) {
      setStatus('connecting');
      connection.current = new WebSocket(
        `ws://localhost:7456/page&id=${pageId}`,
      );
      attempedConnection = true;
    }

    return () => {
      setStatus('idle');
    };
  }, [pageId]);

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
