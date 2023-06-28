/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttleFn(callback: (...args: any[]) => void, ms = 0) {
  let prev = 0;

  return (...args: any[]) => {
    const now = performance.now();

    if (now - prev > ms) {
      prev = now;
      callback(...args);
    }
  };
}
