import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import {
  type MenuPanelActionType,
  MENU_PANEL_ACTIONS,
} from '@/constants/panels/menu';
import * as Styled from './MenuPanel.styled';

type Props = {
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ onAction }: Props) => {
  const handleOnClick = (type: MenuPanelActionType) => {
    onAction(type);
  };

  return (
    <DropdownMenuPrimitive.Root>
      <Styled.Trigger aria-label="Open Menu">
        <IoEllipsisHorizontal size={ICON_SIZES.MEDIUM} />
      </Styled.Trigger>
      <DropdownMenuPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4}>
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <Styled.Item
                key={action.key}
                title={action.name}
                onSelect={() => handleOnClick(action.key)}
              >
                {action.icon({ size: ICON_SIZES.MEDIUM })}
                {action.name}
              </Styled.Item>
            );
          })}
        </Styled.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default MenuPanel;
