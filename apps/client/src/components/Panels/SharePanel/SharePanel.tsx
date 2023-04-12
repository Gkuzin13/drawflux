import { type SharePageParams } from '@shared';
import { TbLink, TbLoader } from 'react-icons/tb';
import Menu from '@/components/core/Menu/Menu';
import { PAGE_SHARE_INFO } from '@/constants/share';
import { useSharePageMutation } from '@/services/api';
import { SharePanelContainer, SharePanelDisclamer } from './SharePanelStyled';

type Props = {
  pageState: SharePageParams;
  isPageShared: boolean;
};

const SharePanel = ({ pageState, isPageShared }: Props) => {
  const [sharePage, { isLoading, isSuccess }] = useSharePageMutation();

  const handlePageShare = async () => {
    const { data } = await sharePage(pageState).unwrap();

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
          {!isPageShared && (
            <>
              <Menu.Item
                fullWidth={true}
                size="small"
                color="secondary-light"
                closeOnItemClick={false}
                onItemClick={handlePageShare}
              >
                {!isLoading && <TbLink />}
                {isLoading || isSuccess ? TbLoader({}) : 'Share this page'}
              </Menu.Item>
              <Menu.Divider type="horizontal" />
            </>
          )}
          <SharePanelDisclamer>
            {isPageShared ? PAGE_SHARE_INFO.ACTIVE : PAGE_SHARE_INFO.CTA}
          </SharePanelDisclamer>
        </Menu.Dropdown>
      </Menu>
    </SharePanelContainer>
  );
};

export default SharePanel;
