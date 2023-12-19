import { styled } from 'shared';
import * as Dialog from '@radix-ui/react-dialog';

export const Content = styled(Dialog.Content, {
  backgroundColor: '$bg',
  boxShadow: '$sm',
  position: 'absolute',
  top: '0',
  width: '100%',
  height: '100%',
  padding: '$4',
  opacity: 0,
  zIndex: 1,
  transition: 'opacity $normal, transform $normal',
  variants: {
    position: {
      right: {
        right: 0,
        borderRadius: '$1 0 0 $1',
        transform: 'translateX(100%) scaleX(0.96)',
        '&[data-state="open"]': {
          opacity: 1,
          transform: 'translateX(0%) scaleX(1)',
        },
      },
      left: {
        left: 0,
        borderRadius: '0 $1 $1 0',
        transform: 'translateX(-100%) scaleX(0.96)',
        '&[data-state="open"]': {
          opacity: 1,
          transform: 'translateX(0%) scaleX(1)',
        },
      },
    },
  },
  defaultVariants: {
    position: 'right',
  },
});

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
  fontWeight: 'bold'
});
