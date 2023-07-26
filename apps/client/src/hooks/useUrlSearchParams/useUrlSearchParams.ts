import { useEffect, useState } from 'react';

type Params = ReturnType<typeof getSearchParams>;

const getSearchParams = (search: string) => {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params);
};

function useUrlSearchParams(): Params {
  const [params, setParams] = useState(getSearchParams(window.location.search));

  useEffect(() => {
    const handleHistoryChange = () => {
      const params = getSearchParams(window.location.search);
      setParams(params);
    };

    window.addEventListener('popstate', handleHistoryChange, {
      passive: true,
    });

    return () => {
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, []);

  return params;
}

export default useUrlSearchParams;
