import { useEffect } from 'react';

function useKeyDown(
  element: HTMLElement | undefined,
  handler: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    if (!element) {
      return;
    }

    element.addEventListener('keydown', handler);

    return () => {
      element.removeEventListener('keydown', handler);
    };
  }, [element, handler]);
}

export default useKeyDown;
