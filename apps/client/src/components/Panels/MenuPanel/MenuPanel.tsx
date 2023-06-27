import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import { type MenuPanelActionType, MENU_PANEL_ACTIONS } from '@/constants/menu';
import {
  DropdownMenuItem,
  MenuPanelTrigger,
  DropdownMenuContent,
} from './MenuPanelStyled';

type Props = {
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ onAction }: Props) => {
  const handleOnClick = (type: MenuPanelActionType) => {
    onAction(type);
  };

  return (
    <DropdownMenu.Root>
      <MenuPanelTrigger aria-label="Open Menu">
        <IoEllipsisHorizontal size={ICON_SIZES.MEDIUM} />
      </MenuPanelTrigger>
      <DropdownMenu.Portal>
        <DropdownMenuContent align="end" sideOffset={4}>
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <DropdownMenuItem
                key={action.key}
                title={action.name}
                onSelect={() => handleOnClick(action.key)}
              >
                {action.icon({ size: ICON_SIZES.MEDIUM })}
                {action.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MenuPanel;
