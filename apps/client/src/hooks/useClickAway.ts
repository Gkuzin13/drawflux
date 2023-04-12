import { type RefObject, useEffect } from 'react';

const EVENTS = ['mousedown', 'touchstart'];

const useClickAway = (ref: RefObject<Element>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const element = event?.target as Element;
      if (ref.current && !ref.current.contains(element)) {
        handler();
      }
    };

    if (ref.current) {
      EVENTS.forEach((fn) => document.addEventListener(fn, listener));
    }

    return () => {
      EVENTS.forEach((fn) => document.removeEventListener(fn, listener));
    };
  }, [ref.current, handler]);
};

export { useClickAway };
