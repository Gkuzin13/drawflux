import { IoEllipsisHorizontal } from 'react-icons/io5';
import Menu from '@/components/core/Menu/Menu';
import { ICON_SIZES } from '@/constants/icon';
import { type MenuPanelActionType, MENU_PANEL_ACTIONS } from '@/constants/menu';
import {
  MenuPanelContainer,
  MenuPanelDropdown,
  MenuPanelToggle,
} from './MenuPanelStyled';

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
        <MenuPanelToggle title="Toggle Menu" size="small" squared>
          <IoEllipsisHorizontal size={ICON_SIZES.MEDIUM} />
        </MenuPanelToggle>
        <MenuPanelDropdown>
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <Menu.Item
                key={action.key}
                title={action.name}
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
