import { styled } from '@/client/shared/styles/theme';
import Button from '../../Button/Button';

export const MenuPanelContainer = styled('div', {
  position: 'fixed',
  right: '$2',
  top: '$2',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  zIndex: 1,
});

export const MenuPanelToggle = styled(Button, {
  boxShadow: '$small',
});

export const MenuPanelContent = styled('div', {
  boxShadow: '$small',
  backgroundColor: '$white',
  padding: '$1',
  borderRadius: '$1',
  marginTop: '$2',
  width: '$11',
});
