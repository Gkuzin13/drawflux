import { useCallback, useEffect, useState } from 'react';
import { BASE_URL, BASE_URL_DEV, IS_PROD } from '@/constants/app';

export type UseFetchConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
};

type UseFetchStatus = 'idle' | 'loading' | 'success' | 'error';
type UseFetchReturn<Data, Body> = [
  { data: Data | null; error: string | null; status: UseFetchStatus },
  (body: Body) => Promise<void>,
];

const defaultConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const baseUrl = IS_PROD ? BASE_URL : BASE_URL_DEV;

let fetched = false;

function useFetch<Data, Body>(
  url: string,
  config?: UseFetchConfig,
  skip = false,
): UseFetchReturn<Data, Body> {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UseFetchStatus>('idle');

  const execute = useCallback(
    async (body?: Body) => {
      setError(null);
      setStatus('loading');

      try {
        const response = await window.fetch(`${baseUrl}${url}`, {
          ...defaultConfig,
          ...config,
          body: body && JSON.stringify(body),
        });

        const { data, error } = await response.json();

        if (!response.ok) {
          const errorMessage = error.message || response.statusText;
          throw new Error(errorMessage);
        }

        setStatus('success');
        setData(data);
      } catch (error) {
        setStatus('error');

        if (error instanceof Error) {
          setError(error.message);
          return;
        }

        setError(String(error));
      }
    },
    [url, config],
  );

  useEffect(() => {
    if (skip || fetched) {
      return;
    }

    const fetchData = async () => {
      await execute();
      fetched = true;
    };

    fetchData();

    return () => {
      setData(null);
      setError(null);
      setStatus('idle');
    };
  }, [url, config, skip]);

  return [{ status, data, error }, execute];
}

export default useFetch;
