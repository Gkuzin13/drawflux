import { safeJSONParse } from './object';

export const storage = {
  set: <T>(key: string, value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Empty
    }
  },
  get: <T>(key: string) => {
    if (!key) {
      throw new Error('Key must be provided');
    }

    const item = window.localStorage.getItem(key);

    return item ? (safeJSONParse(item) as T) : null;
  },
};
