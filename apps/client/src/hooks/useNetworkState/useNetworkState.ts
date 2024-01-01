import { useCallback, useState } from 'react';
import useEvent from '@/hooks/useEvent/useEvent';

type NetworkState = {
  online?: boolean;
};

const isNavigator = typeof navigator !== 'undefined';

const eventOptions = { passive: true };

function getConnectionState(): NetworkState {
  return {
    online: isNavigator ? navigator.onLine : undefined,
  };
}

function useNetworkState() {
  const [state, setState] = useState(getConnectionState());

  const handleStateChange = useCallback(() => {
    setState(getConnectionState());
  }, []);

  useEvent('online', handleStateChange, window, { eventOptions });
  useEvent('offline', handleStateChange, window, { eventOptions });

  return state;
}

export default useNetworkState;
