import { MenuPanelActionType, MENU_PANEL_ACTIONS } from '@/constants/menu';
import { ICON_SIZES } from '@/constants/icon';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import {
  MenuPanelContainer,
  MenuPanelDropdown,
  MenuPanelToggle,
} from './MenuPanelStyled';
import Menu from '@/components/core/Menu/Menu';

type Props = {
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ onAction }: Props) => {
  const handleOnClick = (type: MenuPanelActionType) => {
    onAction(type);
  };

  return (
    <MenuPanelContainer>
      <Menu>
        <MenuPanelToggle title="Toggle Menu" size="small" squared={true}>
          <IoEllipsisHorizontal size={ICON_SIZES.LARGE} />
        </MenuPanelToggle>
        <MenuPanelDropdown data-testid="menu-panel-content">
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <Menu.Item
                key={action.key}
                title={action.name}
                fullWidth={true}
                size="small"
                color="secondary-light"
                onItemClick={() => handleOnClick(action.key)}
              >
                {action.icon({ size: ICON_SIZES.LARGE })}
                {action.name}
              </Menu.Item>
            );
          })}
        </MenuPanelDropdown>
      </Menu>
    </MenuPanelContainer>
  );
};

export default MenuPanel;
