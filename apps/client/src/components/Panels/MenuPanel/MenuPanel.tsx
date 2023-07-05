import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { memo } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import {
  type MenuPanelActionType,
  MENU_PANEL_ACTIONS,
} from '@/constants/panels/menu';
import * as Styled from './MenuPanel.styled';

export type MenuKey = (typeof MENU_PANEL_ACTIONS)[number]['key'];

type Props = {
  disabledItems: MenuKey[] | null;
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ disabledItems, onAction }: Props) => {
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
                onSelect={() => onAction(action.key)}
                disabled={disabledItems?.includes(action.key)}
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

export default memo(MenuPanel);
