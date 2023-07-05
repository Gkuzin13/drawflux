import { useEffect } from 'react';
import { TbLink } from 'react-icons/tb';
import type { SharePageRequestBody, SharePageResponse } from 'shared';
import Button from '@/components/Elements/Button/Button';
import Divider from '@/components/Elements/Divider/Divider';
import Loader from '@/components/Elements/Loader/Loader';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { ICON_SIZES } from '@/constants/icon';
import useFetch from '@/hooks/useFetch';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import { urlSearchParam } from '@/utils/url';
import * as Styled from './SharePanel.styled';

const SharablePageContent = () => {
  const [{ data, status }, sharePage] = useFetch<
    SharePageResponse,
    SharePageRequestBody
  >(
    '/p',
    {
      method: 'POST',
    },
    { skip: true },
  );

  const { nodes, stageConfig } = useAppSelector(selectCanvas);

  useEffect(() => {
    if (data?.id) {
      const updatedURL = urlSearchParam.set(PAGE_URL_SEARCH_PARAM_KEY, data.id);

      window.history.pushState({}, '', updatedURL);
      window.location.reload();
      return;
    }
  }, [data]);

  const handlePageShare = () => {
    if (!nodes.length) {
      return;
    }

    sharePage({ page: { nodes, stageConfig } });
  };

  return (
    <>
      <Button
        align="start"
        color="secondary-light"
        size="extra-small"
        disabled={!nodes.length}
        onClick={handlePageShare}
      >
        {status === 'idle' && <TbLink size={ICON_SIZES.SMALL} />}
        {status === 'loading' || status === 'success' ? (
          <Loader />
        ) : (
          'Share this page'
        )}
      </Button>
      <Divider orientation="horizontal" />
      <Styled.Info>
        Sharing this project will make it available for 24 hours publicly to
        anyone who has access to the provided URL.
      </Styled.Info>
    </>
  );
};

export default SharablePageContent;
