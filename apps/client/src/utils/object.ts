import { shallowEqual as _shallowEqual } from 'react-redux';

export function safeJSONParse<T = unknown>(text: string) {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    return null;
  }
}

export const shallowEqual = _shallowEqual;
