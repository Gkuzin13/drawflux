import { useCallback, useRef } from 'react';

type SetValueCallback<T> = (prevValue: T) => T;

const useRefValue = <T>(initialValue: T) => {
  const value = useRef(initialValue);

  const setValue = useCallback(
    (newValueOrCallback: SetValueCallback<T> | T) => {
      const newValue =
        typeof newValueOrCallback === 'function'
          ? (newValueOrCallback as SetValueCallback<T>)(value.current)
          : newValueOrCallback;

      value.current = newValue;
    },
    [],
  );

  return [value, setValue] as const;
};

export default useRefValue;
