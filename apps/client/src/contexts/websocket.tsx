import { useCallback, useEffect, useRef, useState } from 'react';
import { type WSMessage, WSMessageUtil } from 'shared';
import {
  BASE_WS_URL,
  BASE_WS_URL_DEV,
  IS_PROD,
  PAGE_URL_SEARCH_PARAM_KEY,
  WS_THROTTLE_MS,
} from '@/constants/app';
import { urlSearchParam } from '@/utils/url';
import { createContext } from './createContext';
import { throttleFn } from '@/utils/timed';

type SubscribeFn = <T extends SubscriberKey>(
  type: T,
  handler: SubscriberHandler<T>,
) => Unsubscribe;
type Unsubscribe = () => void;
type UnsubscribeFn = (type: SubscriberKey) => void;
type SendFn = (message: WSMessage, throttle?: boolean) => void;
type SubscriberKey = WSMessage['type'];
type SubscriberHandler<T extends SubscriberKey = SubscriberKey> = (
  data: Extract<WSMessage, { type: T }>['data'],
) => void;
type Subscribers<T extends SubscriberKey = SubscriberKey> = Record<
  T,
  SubscriberHandler<T>
>;
export type WebSocketContextValue = {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  send: SendFn;
  subscribe: SubscribeFn;
  unsubscribe: UnsubscribeFn;
};
type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';
type WebSocketProviderProps = {
  roomId: string | null;
  children: React.ReactNode;
};

let startedConnecting = false;

const wsBaseUrl = IS_PROD ? BASE_WS_URL : BASE_WS_URL_DEV;

// eslint-disable-next-line @typescript-eslint/naming-convention
const _sendWSMessage = (message: WSMessage, webSocket: WebSocket) => {
  const serializedMessage = WSMessageUtil.serialize(message);

  if (serializedMessage) {
    webSocket.send(serializedMessage);
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _throttledSendWSMessage = throttleFn(_sendWSMessage, WS_THROTTLE_MS);

export const [WebSocketContext, useWebSocket] =
  createContext<WebSocketContextValue>('WebSocket');

export const WebSocketProvider = ({
  roomId,
  children,
}: WebSocketProviderProps) => {
  const [status, setStatus] = useState<WSStatus>('idle');

  const webSocket = useRef<WebSocket | null>(null);
  const subscribers = useRef<Partial<Subscribers>>({});

  useEffect(() => {
    if (!roomId) {
      webSocket.current?.close();
      startedConnecting = false;
      return;
    }

    function createWebSocketConnection(url: URL | string) {
      webSocket.current = new WebSocket(url);

      setStatus('connecting');

      webSocket.current.onmessage = (event) => {
        const message = WSMessageUtil.deserialize(event.data);

        if (message && message.type in subscribers.current) {
          const handler = subscribers.current[message.type];

          handler && handler(message.data);
        }
      };

      webSocket.current.onopen = () => setStatus('connected');
      webSocket.current.onclose = () => setStatus('disconnected');
      webSocket.current.onerror = () => setStatus('disconnected');
    }

    if (!startedConnecting) {
      const url = createWSUrl(roomId);

      createWebSocketConnection(url);

      startedConnecting = true;
    }
  }, [roomId]);

  const unsubscribe = useCallback<UnsubscribeFn>((type) => {
    delete subscribers.current[type];
  }, []);

  const subscribe = useCallback<SubscribeFn>(
    (type, handler) => {
      subscribers.current[type] = handler as never;

      return () => unsubscribe(type);
    },
    [unsubscribe],
  );

  const send = useCallback<SendFn>((message, throttle) => {
    if (!webSocket.current) {
      return;
    }

    if (throttle) {
      _throttledSendWSMessage(message, webSocket.current);
    } else {
      _sendWSMessage(message, webSocket.current);
    }
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        isDisconnected: status === 'disconnected',
        send,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

function createWSUrl(roomId: string) {
  return urlSearchParam.set(
    'id',
    roomId,
    `${wsBaseUrl}/${PAGE_URL_SEARCH_PARAM_KEY}`,
  );
}
