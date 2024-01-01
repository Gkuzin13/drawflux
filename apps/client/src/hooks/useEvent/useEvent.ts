import { isBrowser } from '@/utils/is';
import { useEffect, useRef } from 'react';

type EventsMap = HTMLElementEventMap &
  WindowEventMap &
  DocumentEventMap &
  MediaQueryListEventMap &
  WebSocketEventMap;

type HandlerElements =
  | Document
  | HTMLElement
  | MediaQueryList
  | Window
  | WebSocket;

const defaultTarget = isBrowser ? window : null;

function useEvent<K extends keyof EventsMap>(
  name: K,
  handler: ((event: EventsMap[K]) => void) | undefined,
  element: HandlerElements | null = defaultTarget,
  options?: {
    eventOptions?: AddEventListenerOptions;
    deps?: unknown[];
  },
) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element || !savedHandler.current) return;

    const listener = savedHandler.current as EventListenerOrEventListenerObject;
    const eventOptions = options?.eventOptions;

    element.addEventListener(name, listener, eventOptions);

    return () => {
      element.removeEventListener(name, listener, eventOptions);
    };
  }, [name, element, JSON.stringify(options)]);
}

export default useEvent;
