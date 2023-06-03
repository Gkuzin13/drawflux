import { useEffect, useState } from 'react';

type NetworkState = {
  online?: boolean;
};

const isNavigator = typeof navigator !== 'undefined';

function getConnectionState(): NetworkState {
  return {
    online: isNavigator ? navigator.onLine : undefined,
  };
}

function useNetworkState() {
  const [state, setState] = useState(getConnectionState());

  useEffect(() => {
    const handleStateChange = () => {
      setState(getConnectionState());
    };

    window.addEventListener('online', handleStateChange, { passive: true });
    window.addEventListener('offline', handleStateChange, { passive: true });

    return () => {
      window.removeEventListener('online', handleStateChange);
      window.removeEventListener('offline', handleStateChange);
    };
  });

  return state;
}

export default useNetworkState;
