import type { UpdatePageRequestBody, UpdatePageResponse } from 'shared';
import useFetch, { type UseFetchConfig } from './useFetch';
import { useEffect } from 'react';
import { useNotifications } from '@/contexts/notifications';
import useUrlSearchParams from './useUrlSearchParams/useUrlSearchParams';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';

const options: UseFetchConfig = {
  method: 'PATCH',
};

function usePageMutation() {
  const params = useUrlSearchParams();

  const pageId = params[PAGE_URL_SEARCH_PARAM_KEY];
  const url = `/p/${pageId}`;

  const [{ error }, updatePage] = useFetch<
    UpdatePageResponse,
    UpdatePageRequestBody
  >(url, options, true);

  const notifications = useNotifications();

  useEffect(() => {
    if (error) {
      notifications.add({
        title: 'Error',
        description: 'Failed to update the drawing',
        type: 'error',
      });
    }
  }, [error, notifications]);

  return { updatePage };
}

export default usePageMutation;
