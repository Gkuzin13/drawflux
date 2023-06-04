import { useLayoutEffect, useState } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    function updateWindowSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', updateWindowSize, { passive: true });

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  return size;
}

export default useWindowSize;
