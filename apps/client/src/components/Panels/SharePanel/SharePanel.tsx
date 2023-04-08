import { TbLink } from 'react-icons/tb';
import { SharePanelContainer, SharePanelDisclamer } from './SharePanelStyled';
import Menu from '@/components/core/Menu/Menu';

type Props = {
  onShare: () => void;
};

const SharePanel = ({ onShare }: Props) => {
  const handleActionClick = () => {
    onShare();
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
            onItemClick={handleActionClick}
          >
            <TbLink />
            Share this page
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
