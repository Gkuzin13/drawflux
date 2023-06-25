import { useEffect } from 'react';
import { type WSMessage, WSMessageUtil } from 'shared';

type UseWSMessageArgs = {
  connection: WebSocket | null | undefined;
  isConnected: boolean | undefined;
  onMessage: (message: WSMessage) => void;
};

function useWSMessage(
  { connection, isConnected, onMessage }: UseWSMessageArgs,
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (!connection || !isConnected) {
      return;
    }

    const listener = (event: MessageEvent) => {
      const message = WSMessageUtil.deserialize(event.data);

      if (!message?.data || !message?.type) {
        return;
      }

      onMessage(message);
    };

    connection.addEventListener('message', listener);

    return () => {
      connection.removeEventListener('message', listener);
    };
  }, [connection, isConnected, ...deps]);
}

export default useWSMessage;
