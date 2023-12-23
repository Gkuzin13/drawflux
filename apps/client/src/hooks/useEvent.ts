import { useEffect } from 'react';
import { isBrowser } from '@/utils/is';

const defaultTarget = isBrowser ? window : null;

function useEvent<K extends keyof HTMLElementEventMap>(
  name: K,
  handler?: (event: HTMLElementEventMap[K]) => void,
  element: EventTarget | undefined | null = defaultTarget,
  options?: {
    eventOptions?: EventListenerOptions;
    deps?: unknown[];
  },
) {
  useEffect(() => {
    if (!element) return;

    element.addEventListener(
      name,
      handler as EventListenerOrEventListenerObject,
      options?.eventOptions,
    );

    return () => {
      element.removeEventListener(
        name,
        handler as EventListenerOrEventListenerObject,
        options?.eventOptions,
      );
    };
  }, [name, handler, element, JSON.stringify(options)]);
}

export default useEvent;
