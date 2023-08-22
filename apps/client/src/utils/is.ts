export function isObject(val: unknown): boolean {
  return toString.call(val) === '[object Object]';
}
export const isArray = Array.isArray;
