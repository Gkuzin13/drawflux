import * as Dialog from '@radix-ui/react-dialog';
import { styled } from 'shared';

export const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: 'rgba(0, 0, 0, 0.125)',
  position: 'fixed',
  inset: 0,
  zIndex: 1,
  opacity: 0,
  transition: 'opacity $normal',
  '&[data-state="open"]': {
    opacity: 1,
  },
});

export const DialogContent = styled(Dialog.Content, {
  backgroundColor: '$white',
  borderRadius: '$1',
  boxShadow: '$small',
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: 1,
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  padding: '$6',
  opacity: 0,
  transform: 'translate(-50%, -48%) scale(0.96)',
  transition: 'opacity $normal, transform $normal',
  '&[data-state="open"]': {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
});

export const DialogCloseButton = styled(Dialog.Close, {
  position: 'absolute',
  right: '$3',
  top: '$3',
});

export const DialogTitle = styled(Dialog.Title, {
  fontSize: '$3',
  fontWeight: 'bold',
  paddingBottom: '$2',
});

export const DialogDescription = styled(Dialog.Description, {
  fontSize: '$2',
  color: '$gray700',
});
