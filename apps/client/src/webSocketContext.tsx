import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { PAGE_URL_SEARCH_PARAM_KEY } from './constants/app';
import { urlSearchParam } from './utils/url';

type WSContextValue = {
  connection: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  pageId: string | null;
};

export const WebSocketContext = createContext<WSContextValue | null>(null);

let attempedConnection = false;
const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(!!pageId);

  useEffect(() => {
    if (!connection) {
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

    connection.addEventListener('open', onOpen);
    connection.addEventListener('close', onClose);

    return () => {
      connection.removeEventListener('open', onOpen);
      connection.removeEventListener('close', onClose);
    };
  }, [connection]);

  useEffect(() => {
    if (pageId && !attempedConnection) {
      setIsConnecting(true);
      setConnection(new WebSocket(`ws://localhost:7456/page&id=${pageId}`));
      attempedConnection = true;
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{ connection, isConnected, isConnecting, pageId }}
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
