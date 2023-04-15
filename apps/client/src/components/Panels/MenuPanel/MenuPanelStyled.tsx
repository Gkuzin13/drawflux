import { styled } from 'shared';
import Menu from '@/components/core/Menu/Menu';

export const MenuPanelContainer = styled('div', {
  position: 'fixed',
  right: '$2',
  top: '$2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  zIndex: 1,
});

export const MenuPanelToggle = styled(Menu.Toggle, {
  boxShadow: '$small',
  backgroundColor: '$white',
});

export const MenuPanelDropdown = styled(Menu.Dropdown, {
  backgroundColor: '$white',
});
