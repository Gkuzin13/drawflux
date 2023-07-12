import { type RefObject, useEffect } from 'react';

const EVENTS = ['mousedown', 'touchstart', 'pointerdown'] as const;

const useClickAway = (ref: RefObject<Element>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: PointerEvent | TouchEvent | MouseEvent) => {
      const element = event.target;

      if (ref.current && element && !ref.current.contains(element as Element)) {
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
