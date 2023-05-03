import { useEffect, useState } from 'react';

function useForceUpdate(deps: unknown[]) {
  const [_, setForcedUpdate] = useState(0);

  useEffect(() => {
    setForcedUpdate((prevValue) => prevValue + 1);
  }, [...deps]);

  return { rerenderCount: _ };
}

export default useForceUpdate;
