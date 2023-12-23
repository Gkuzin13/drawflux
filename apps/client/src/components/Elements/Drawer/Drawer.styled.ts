import { styled } from 'shared';
import { Button } from '../Button/Button.styled';
import * as Dialog from '@radix-ui/react-dialog';

export const Content = styled(Dialog.Content, {
  backgroundColor: '$bg',
  boxShadow: '$sm',
  position: 'absolute',
  top: '0',
  minHeight: '100vh',
  maxHeight: '100vh',
  minWidth: 'min-content',
  zIndex: 999,
  variants: {
    position: {
      right: {
        right: 0,
        borderRadius: '$2 0 0 $2',
      },
    },
  },
  defaultVariants: {
    position: 'right',
  },
});

export const Trigger = styled(Dialog.Trigger, Button);

export const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const Close = styled(Dialog.Close, {
  display: 'grid',
  placeItems: 'center',
  padding: '$1',
});

export const Title = styled('h3', {
  fontSize: '$4',
  fontWeight: 'bold',
});
