import { useCallback, useEffect, useState } from 'react';

function useForceUpdate(deps?: unknown[]) {
  const [_, setForcedUpdate] = useState(0);

  const forceUpdate = useCallback(
    () => setForcedUpdate((prevValue) => prevValue + 1),
    [],
  );

  useEffect(() => {
    forceUpdate();
  }, [...(deps ?? [])]);

  return { forceUpdate, rerenderCount: _ };
}

export default useForceUpdate;
