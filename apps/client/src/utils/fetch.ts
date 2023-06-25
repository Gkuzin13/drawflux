import type { ServerResponse } from 'shared';
import { BASE_URL } from '@/constants/app';

const defaultConfig: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const baseUrl =
  process.env.NODE_ENV === 'production' ? BASE_URL : 'http://localhost:7456';

export async function fetchData<ReturnType>(
  url: string,
  config?: RequestInit,
): Promise<{ data?: ReturnType; error?: { message: string } }> {
  try {
    const response = await window.fetch(`${baseUrl}${url}`, {
      ...defaultConfig,
      ...config,
    });

    const { data, error } = await response.json();

    if (!response.ok) {
      const errorMessage = error.message || response.statusText;
      throw new Error(errorMessage);
    }

    return { data: data as ReturnType };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error };
    }
    return { error: { message: String(error) } };
  }
}
