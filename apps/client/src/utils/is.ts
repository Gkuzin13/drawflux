export function isObject(val: unknown): boolean {
  return toString.call(val) === '[object Object]';
}

export const isArray = Array.isArray;

export const now = () => Date.now();

export const noop = () => {/**/};

export const isBrowser = typeof window !== 'undefined';
