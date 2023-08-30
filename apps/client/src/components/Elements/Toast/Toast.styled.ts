import * as ToastPrimitive from '@radix-ui/react-toast';
import { hide, slideLeft, styled } from 'shared';

export const Container = styled(ToastPrimitive.Root, {
  backgroundColor: '$bg',
  borderRadius: '$1',
  boxShadow: '$sm',
  padding: '$3',
  display: 'grid',
  gridTemplateAreas: "'title close' 'description close'",
  gridTemplateColumns: 'auto max-content',
  gap: '$2 $6',
  fontSize: '$2',
  '&[data-state="open"]': {
    animation: `${slideLeft} $transitions$fast forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} $transitions$fast forwards`,
  },
});

export const Title = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  fontWeight: 'bold',
});

export const Description = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  fontSize: '$1',
});

export const Close = styled(ToastPrimitive.Close, {
  gridArea: 'close',
});

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
