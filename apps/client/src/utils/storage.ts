const serializer = JSON.stringify;
const deserializer = JSON.parse;

export const storage = {
  set: <T>(key: string, value: T) => {
    try {
      window.localStorage.setItem(key, serializer(value));
    } catch (error) {
      // Empty
    }
  },
  get: <T>(key: string) => {
    if (!key) {
      throw new Error('Key must be provided');
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? (deserializer(item) as T) : null;
    } catch (error) {
      return null;
    }
  },
};
