import { useEffect } from 'react';
import { type WSMessage, WSMessageUtil } from 'shared';

function useWSMessage(
  connection: WebSocket | null | undefined,
  onMessage: (message: WSMessage) => void,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (!connection) {
      return;
    }

    const listener = (event: MessageEvent) => {
      const message = WSMessageUtil.deserialize(event.data);

      if (message?.data && message?.type) {
        onMessage(message);
      }
    };

    connection.addEventListener('message', listener);

    return () => {
      connection.removeEventListener('message', listener);
    };
  }, [connection, ...deps]);
}

export default useWSMessage;
