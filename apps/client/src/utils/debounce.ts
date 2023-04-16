/* eslint-disable @typescript-eslint/no-explicit-any */

export function debounce<T extends (...args: any[]) => void>(fn: T, ms = 0) {
  let timeoutId: number | any;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(args), ms);
  };
}
