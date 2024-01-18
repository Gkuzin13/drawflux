import { useCallback } from 'react';

type RefType<T> = React.MutableRefObject<T> | React.RefCallback<T> | null;

function useSharedRef<T>(
  refA: RefType<T>,
  refB: RefType<T>,
): React.RefCallback<T> {
  return useCallback(
    (instance) => {
      if (typeof refA === 'function') {
        refA(instance);
      } else if (refA && instance) {
        refA.current = instance;
      }
      if (typeof refB === 'function') {
        refB(instance);
      } else if (refB && instance) {
        refB.current = instance;
      }
    },
    [refA, refB],
  );
}

export default useSharedRef;
