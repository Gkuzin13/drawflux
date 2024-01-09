import { useEffect, useRef } from 'react';

function useAutoFocus<T extends HTMLElement>(deps?: unknown[]) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [JSON.stringify(deps)]);

  return ref;
}

export default useAutoFocus;
