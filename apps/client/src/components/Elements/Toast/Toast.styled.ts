import * as ToastPrimitive from '@radix-ui/react-toast';
import { hide, slideLeft, styled } from 'shared';

export const Container = styled(ToastPrimitive.Root, {
  backgroundColor: '$bg',
  borderRadius: '$2',
  boxShadow: '$sm',
  padding: '$3',
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '$2',
  '&[data-state="open"]': {
    animation: `${slideLeft} $transitions$fast forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} $transitions$fast forwards`,
  },
});

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$2'
});

export const Title = styled(ToastPrimitive.Title);

export const Description = styled(ToastPrimitive.Description, {
  color: '$gray600'
});

export const Close = styled(ToastPrimitive.Close);

export const Viewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  bottom: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '$4',
  gap: '$3',
  minWidth: '$12',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 999,
  outline: 'none',
});
