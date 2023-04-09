import { TbLink, TbLoader } from 'react-icons/tb';
import { SharePanelContainer, SharePanelDisclamer } from './SharePanelStyled';
import { SharePageParams } from '@shared';
import { useSharePageMutation } from '@/services/api';
import Menu from '@/components/core/Menu/Menu';

type Props = {
  pageState: SharePageParams;
};

const SharePanel = ({ pageState }: Props) => {
  const [sharePage, { isLoading, isSuccess }] = useSharePageMutation();

  const handlePageShare = async () => {
    const { data, error } = await sharePage(pageState).unwrap();

    if (data?.id) {
      window.history.pushState({}, '', `/p/${data.id}`);
      window.location.reload();
      return;
    }
  };

  return (
    <SharePanelContainer>
      <Menu>
        <Menu.Toggle size="normal" color="primary">
          Share
        </Menu.Toggle>
        <Menu.Dropdown>
          <Menu.Item
            fullWidth={true}
            size="small"
            color="secondary-light"
            closeOnItemClick={false}
            onItemClick={handlePageShare}
          >
            {!isLoading || (!isSuccess && <TbLink />)}
            {isLoading || isSuccess ? TbLoader({}) : 'Share this page'}
          </Menu.Item>
          <Menu.Divider type="horizontal" />
          <SharePanelDisclamer>
            Sharing this project will make it available for 24 hours publicly to
            anyone who has access to the provided URL.
          </SharePanelDisclamer>
        </Menu.Dropdown>
      </Menu>
    </SharePanelContainer>
  );
};

export default SharePanel;
