import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { memo } from 'react';
import {
  type MenuPanelActionType,
  MENU_PANEL_ACTIONS,
} from '@/constants/panels/menu';
import * as Styled from './MenuPanel.styled';
import Icon from '@/components/Elements/Icon/Icon';

export type MenuKey = (typeof MENU_PANEL_ACTIONS)[number]['value'];

type Props = {
  disabledItems: MenuKey[] | null;
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ disabledItems, onAction }: Props) => {
  return (
    <DropdownMenuPrimitive.Root>
      <Styled.Trigger aria-label="Open Menu">
        <Icon name="dots" size="lg" />
      </Styled.Trigger>
      <DropdownMenuPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4}>
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <Styled.Item
                key={action.value}
                title={action.name}
                onSelect={() => onAction(action.value)}
                disabled={disabledItems?.includes(action.value)}
              >
                <Icon name={action.icon} />
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
