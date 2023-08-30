import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { memo } from 'react';
import {
  type MenuPanelActionType,
  MENU_PANEL_ACTIONS,
} from '@/constants/panels/menu';
import Icon from '@/components/Elements/Icon/Icon';
import Switch from '@/components/Elements/Switch/Switch';
import Divider from '@/components/Elements/Divider/Divider';
import { useTheme } from '@/contexts/theme';
import * as Styled from './MenuPanel.styled';

export type MenuKey = (typeof MENU_PANEL_ACTIONS)[number]['value'];

type Props = {
  disabledItems: MenuKey[] | null;
  onAction: (type: MenuPanelActionType) => void;
};

const MenuPanel = ({ disabledItems, onAction }: Props) => {
  const theme = useTheme();

  const isDarkMode = theme.value === 'dark';

  const handleDarkModeChange = (checked: boolean) => {
    theme.set(checked ? 'dark' : 'default');
  };

  return (
    <DropdownMenuPrimitive.Root modal={true}>
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
          <Divider css={{ margin: '$1 0' }} />
          <Styled.Item onSelect={(e) => e.preventDefault()}>
            <Switch
              id="dark-mode"
              label="Dark Mode"
              checked={isDarkMode}
              icon={isDarkMode ? 'moonStars' : 'moon'}
              onCheckedChange={handleDarkModeChange}
              data-testid="dark-mode-switch"
            />
          </Styled.Item>
        </Styled.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export default memo(MenuPanel);
