import { useCallback, useRef, useState } from 'react';
import { WSMessageUtil } from 'shared';
import { WS_THROTTLE_MS } from '@/constants/app';
import { createContext } from './createContext';
import { throttleFn } from '@/utils/timed';
import type { WSMessage } from 'shared';

type SubscribeFn = <T extends SubscriberKey>(
  type: T,
  handler: SubscriberHandler<T>,
) => Unsubscribe;
type Unsubscribe = () => void;
type UnsubscribeFn = (type: SubscriberKey) => void;
type ConnectFn = (url: URL | string) => void;
type DisconnectFn = () => void;
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
  connect: ConnectFn;
  disconnect: DisconnectFn;
  send: SendFn;
  subscribe: SubscribeFn;
  unsubscribe: UnsubscribeFn;
};
type WSStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

// eslint-disable-next-line @typescript-eslint/naming-convention
const _sendWSMessage = (message: WSMessage, webSocket: WebSocket) => {
  const serializedMessage = WSMessageUtil.serialize(message);

  if (serializedMessage) {
    webSocket.send(serializedMessage);
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _throttledSendWSMessage = throttleFn(_sendWSMessage, WS_THROTTLE_MS);

let initiatedConnection = false;

export const [WebSocketContext, useWebSocket] =
  createContext<WebSocketContextValue>('WebSocket');

export const WebSocketProvider = ({ children }: React.PropsWithChildren) => {
  const [status, setStatus] = useState<WSStatus>('idle');

  const webSocket = useRef<WebSocket | null>(null);
  const subscribers = useRef<Partial<Subscribers>>({});

  const connect = useCallback<ConnectFn>((url) => {
    if (initiatedConnection) return;

    initiatedConnection = true;

    setStatus('connecting');

    webSocket.current = new WebSocket(url);

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
  }, []);

  const disconnect = useCallback<DisconnectFn>(() => {
    webSocket.current?.close();
    initiatedConnection = false;
  }, []);

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
        connect,
        disconnect,
        send,
        subscribe,
        unsubscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
