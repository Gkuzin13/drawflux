/* eslint-disable @typescript-eslint/no-explicit-any */
export function throttleFn<T extends any[]>(
  callback: (...args: T) => void,
  ms = 0,
) {
  let prev = 0;

  return (...args: Parameters<typeof callback>) => {
    const now = performance.now();

    if (now - prev > ms) {
      prev = now;
      callback(...args);
    }
  };
}

export function createSingleClickHandler(
  callback: (...args: any[]) => void,
  timeout = 400,
) {
  let pendingClick: number;
  let clickCount = 0;

  return (...args: any[]) => {
    clickCount++;
    clearTimeout(pendingClick);

    if (clickCount >= 2) {
      clickCount = 0;
    } else {
      pendingClick = window.setTimeout(() => {
        callback(...args);
        clickCount = 0;
      }, timeout);
    }
  };
}
