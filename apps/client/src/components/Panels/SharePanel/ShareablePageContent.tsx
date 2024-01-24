import { useState } from 'react';
import Button from '@/components/Elements/Button/Button';
import Divider from '@/components/Elements/Divider/Divider';
import Loader from '@/components/Elements/Loader/Loader';
import Icon from '@/components/Elements/Icon/Icon';
import Text from '@/components/Elements/Text/Text';
import api from '@/services/api';
import { useAppSelector } from '@/stores/hooks';
import { selectNodes, selectConfig } from '@/services/canvas/slice';
import { urlSearchParam } from '@/utils/url';
import { CONSTANTS } from 'shared';

const SharablePageContent = () => {
  const [loading, setLoading] = useState(false);

  const nodes = useAppSelector(selectNodes);
  const stageConfig = useAppSelector(selectConfig);

  const handlePageShare = async () => {
    if (!nodes.length) {
      return;
    }

    setLoading(true);
    
    const { data, error } = await api.sharePage({
      page: { nodes, stageConfig },
    });

    if (data?.id) {
      const updatedURL = urlSearchParam.set(
        CONSTANTS.COLLAB_ROOM_URL_PARAM,
        data.id,
      );

      window.history.pushState({}, '', updatedURL);
      window.location.reload();
    }

    if (error) {
      setLoading(false);
    }
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
      <Text as="p" size="xs" color="gray500" lineHeight="normal">
        Sharing this project will make it available for 24 hours publicly to
        anyone who has access to the provided URL.
      </Text>
    </>
  );
};

export default SharablePageContent;
