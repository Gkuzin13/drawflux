import { styled } from 'shared';
import Button from '../Button/Button';

export const ModalContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  zIndex: 999,
});

export const ModalDialog = styled('div', {
  position: 'relative',
  padding: '$10',
  borderRadius: '$1',
  backgroundColor: '$white',
  minWidth: '40vw',
  zIndex: 1,
});

export const ModalDialogTitle = styled('div', {
  fontSize: '$4',
});

export const ModalDialogContent = styled('div', {
  paddingTop: '$4',
});

export const ModalCloseButton = styled(Button, {
  position: 'absolute',
  top: '$4',
  right: '$4',
});
