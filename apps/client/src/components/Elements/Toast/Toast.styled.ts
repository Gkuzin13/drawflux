import * as ToastPrimitive from '@radix-ui/react-toast';
import { duration, easing, hide, slideLeft, styled } from 'shared';

export const Container = styled(ToastPrimitive.Root, {
  backgroundColor: '$white',
  borderRadius: '$1',
  boxShadow: '$small',
  padding: '$3',
  display: 'grid',
  gridTemplateAreas: "'title close' 'description close'",
  gridTemplateColumns: 'auto max-content',
  gap: '$2 $6',
  fontSize: '$2',
  '&[data-state="open"]': {
    animation: `${slideLeft} ${duration.fast} ${easing.normal} forwards`,
  },
  '&[data-state="closed"]': {
    animation: `${hide} ${duration.fast} ${easing.normal} forwards`,
  },
});

export const Title = styled(ToastPrimitive.Title, {
  gridArea: 'title',
  fontWeight: 'bold',
  color: '$black',
});

export const Description = styled(ToastPrimitive.Description, {
  gridArea: 'description',
  color: '$gray800',
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
  minWidth: '$13',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 999,
  outline: 'none',
});
