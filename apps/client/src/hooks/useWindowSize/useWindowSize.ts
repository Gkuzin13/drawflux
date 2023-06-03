import { useLayoutEffect, useState } from 'react';

type WindowSize = [number, number];

function useWindowSize() {
  const [size, setSize] = useState<WindowSize>([
    window.innerWidth,
    window.innerHeight,
  ]);

  useLayoutEffect(() => {
    function updateWindowSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateWindowSize, { passive: true });

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return size;
}

export default useWindowSize;
