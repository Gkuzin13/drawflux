import { useCallback, useEffect, useState } from 'react';
import { BASE_URL } from '@/constants/app';

type Config = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
};

type UseFetchStatus = 'idle' | 'loading' | 'success' | 'error';
type UseFetchReturn<Data, Body> = [
  { data: Data | null; error: string | null; status: UseFetchStatus },
  (body: Body) => Promise<void>,
];

let fetched = false;

const defaultConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const defaultOptions = {
  skip: false,
};

const baseUrl =
  process.env.NODE_ENV === 'production' ? BASE_URL : 'http://localhost:7456';

function useFetch<Data, Body>(
  url: string,
  config?: Config,
  options = defaultOptions,
): UseFetchReturn<Data, Body> {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UseFetchStatus>('idle');

  const execute = useCallback(
    async (body?: Body) => {
      try {
        setError(null);
        setStatus('loading');

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
    if (options.skip || fetched) {
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
  }, [url, config, options]);

  return [{ status, data, error }, execute];
}

export default useFetch;
