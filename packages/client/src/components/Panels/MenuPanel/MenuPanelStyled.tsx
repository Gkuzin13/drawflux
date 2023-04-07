import { styled } from '@shared';
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
  backgroundColor: '$white',
});

export const MenuPanelContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  boxShadow: '$small',
  backgroundColor: '$white',
  padding: '$1',
  borderRadius: '$1',
  marginTop: '$2',
  width: '$11',
});
