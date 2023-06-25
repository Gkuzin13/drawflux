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

export const WebSocketContext = createContext<WSContextValue | null>(null);

const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);

let attempedConnection = false;

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(!!pageId);

  const connection = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!connection.current) {
      return;
    }

    const onOpen = () => {
      setIsConnecting(false);
      setIsConnnected(true);
    };

    const onClose = () => {
      setIsConnnected(false);
      setIsConnecting(false);
    };

    connection.current.addEventListener('open', onOpen);
    connection.current.addEventListener('close', onClose);

    return () => {
      connection.current?.removeEventListener('open', onOpen);
      connection.current?.removeEventListener('close', onClose);
    };
  }, [connection]);

  useEffect(() => {
    if (pageId && !attempedConnection) {
      setIsConnecting(true);
      connection.current = new WebSocket(
        `ws://localhost:7456/page&id=${pageId}`,
      );
    }

    return () => {
      setIsConnecting(false);
      setIsConnnected(false);
    };
  }, []);

  useEffect(() => {
    if (connection && !attempedConnection) {
      attempedConnection = true;
    }
  }, [connection]);

  return (
    <WebSocketContext.Provider
      value={{
        connection: connection.current,
        isConnected,
        isConnecting,
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
