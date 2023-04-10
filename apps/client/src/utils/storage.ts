const serializer = JSON.stringify;
const deserializer = JSON.parse;

export const setToStorage = <T>(key: string, value: T) => {
  if (!key) {
    throw new Error('Key must be provided');
  }

  try {
    window.localStorage.setItem(key, serializer(value));
  } catch (error) {
    // Empty
  }
};

export const getFromStorage = <T>(key: string) => {
  if (!key) {
    throw new Error('Key must be provided');
  }

  try {
    const item = window.localStorage.getItem(key);

    return item ? (deserializer(item) as T) : null;
  } catch (error) {
    return null;
  }
};
