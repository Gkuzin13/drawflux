import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { PAGE_URL_SEARCH_PARAM_KEY } from './constants/app';
import { urlSearchParam } from './utils/url';

export const WebSocketContext = createContext<WebSocket | null>(null);

let created = false;

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const [connection, setConnection] = useState<WebSocket | null>(null);

  useEffect(() => {
    const pageId = urlSearchParam.get(PAGE_URL_SEARCH_PARAM_KEY);

    if (pageId && !created) {
      created = true;
      setConnection(new WebSocket(`ws://localhost:7456/page&id=${pageId}`));
    }
  }, []);

  return (
    <WebSocketContext.Provider value={connection}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocket | null => {
  const ctx = useContext(WebSocketContext);

  if (ctx === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }

  return ctx;
};
