import { WSMessageUtil, type WSMessage } from 'shared';
import { WS_THROTTLE_MS } from '@/constants/app';
import { throttleFn } from './timed';

export function sendMessage(connection: WebSocket | null, message: WSMessage) {
  if (connection) {
    const serializedMessage = WSMessageUtil.serialize(message);
    serializedMessage && connection.send(serializedMessage);
  }
}

export const sendThrottledMessage = throttleFn(sendMessage, WS_THROTTLE_MS);
