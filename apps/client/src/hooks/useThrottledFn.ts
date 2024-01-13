import { throttleFn } from '@/utils/timed';
import { useEffect, useRef } from 'react';

const _DEFAULT_THROTTLE_MS = 35;

/* eslint-disable @typescript-eslint/no-explicit-any */
function useThrottledFn<T extends any[]>(
  callback: (...args: T) => void,
  ms = _DEFAULT_THROTTLE_MS,
) {
  const throttledFn = useRef(throttleFn(callback, ms));

  useEffect(() => {
    throttledFn.current = throttleFn(callback, ms);
  }, [callback]);

  return throttledFn.current;
}

export default useThrottledFn;
