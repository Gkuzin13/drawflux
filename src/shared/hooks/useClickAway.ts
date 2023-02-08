import { RefObject, useEffect } from 'react';

const EVENTS = ['mousedown', 'touchstart'];

const useClickAway = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: any) => {
      const { target } = event ?? {};

      if (ref.current && !ref.current.contains(target)) {
        console.log('clicked away');
        handler();
      }
    };

    if (ref.current) {
      EVENTS.forEach((fn) => document.addEventListener(fn, listener));
    }

    return () => {
      EVENTS.forEach((fn) => document.removeEventListener(fn, listener));
    };
  }, [ref, handler]);
};

export { useClickAway };
