import { WSMessageUtil, type WSMessage } from 'shared';

export function sendMessage(connection: WebSocket | null, message: WSMessage) {
  if (connection) {
    const serializedMessage = WSMessageUtil.serialize(message);
    serializedMessage && connection.send(serializedMessage);
  }
}
