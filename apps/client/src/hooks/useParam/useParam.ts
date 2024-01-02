import { useCallback, useState } from 'react';
import useEvent from '@/hooks/useEvent/useEvent';

const getSearchParam = (name: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(name);
};

function useParam(name: string) {
  const [param, setParam] = useState(getSearchParam(name));

  const handlePopState = useCallback(() => {
    setParam(getSearchParam(name));
  }, []);

  useEvent('popstate', handlePopState);

  return param;
}

export default useParam;
