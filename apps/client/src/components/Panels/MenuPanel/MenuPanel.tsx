import { memo } from 'react';
import { MENU_PANEL_ACTIONS } from '@/constants/panels/menu';
import DropdownMenu from '@/components/Elements/DropdownMenu/DropdownMenu';
import Icon from '@/components/Elements/Icon/Icon';
import Switch from '@/components/Elements/Switch/Switch';
import Divider from '@/components/Elements/Divider/Divider';
import { useTheme } from '@/contexts/theme';
import * as Styled from './MenuPanel.styled';
import type { MenuPanelActionType } from '@/constants/panels/menu';

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
    <DropdownMenu modal={true}>
      <DropdownMenu.Trigger aria-label="Open Menu">
        <Icon name="dots" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <Styled.Content align="end" sideOffset={4}>
          {MENU_PANEL_ACTIONS.map((action) => {
            return (
              <DropdownMenu.Item
                key={action.value}
                title={action.name}
                onSelect={() => onAction(action.value)}
                disabled={disabledItems?.includes(action.value)}
              >
                <Icon name={action.icon} />
                {action.name}
              </DropdownMenu.Item>
            );
          })}
          <Divider css={{ margin: '$1 0' }} />
          <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
            <Switch
              id="dark-mode"
              label="Dark Mode"
              checked={isDarkMode}
              icon={isDarkMode ? 'moonStars' : 'moon'}
              onCheckedChange={handleDarkModeChange}
              data-testid="dark-mode-switch"
            />
          </DropdownMenu.Item>
        </Styled.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};

export default memo(MenuPanel);
