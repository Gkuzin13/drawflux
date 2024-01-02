import { useState } from 'react';
import Button from '@/components/Elements/Button/Button';
import Divider from '@/components/Elements/Divider/Divider';
import Loader from '@/components/Elements/Loader/Loader';
import Icon from '@/components/Elements/Icon/Icon';
import api from '@/services/api';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { useAppSelector } from '@/stores/hooks';
import { selectNodes, selectConfig } from '@/services/canvas/slice';
import { urlSearchParam } from '@/utils/url';
import * as Styled from './SharePanel.styled';

const SharablePageContent = () => {
  const [loading, setLoading] = useState(false);

  const nodes = useAppSelector(selectNodes);
  const stageConfig = useAppSelector(selectConfig);

  const handlePageShare = () => {
    if (!nodes.length) {
      return;
    }

    setLoading(true);

    const [request] = api.sharePage({
      page: { nodes, stageConfig },
    });

    request
      .then((data) => {
        if (data?.id) {
          const updatedURL = urlSearchParam.set(
            PAGE_URL_SEARCH_PARAM_KEY,
            data.id,
          );

          window.history.pushState({}, '', updatedURL);
          window.location.reload();
        }
      })
      .catch(() => setLoading(false));
  };

  return (
    <>
      <Button
        align="start"
        color="secondary-light"
        size="xs"
        disabled={!nodes.length}
        onClick={handlePageShare}
      >
        {!loading && <Icon name="link" size="sm" />}
        {loading ? <Loader /> : 'Share this page'}
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
