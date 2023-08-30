import * as Switch from '@radix-ui/react-switch';
import { styled } from 'shared';

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$1',
  width: '100%',
});

export const Label = styled('label', {
  fontSize: '$1',
  marginRight: 'auto',
});

export const Root = styled(Switch.Root, {
  all: 'unset',
  width: 'calc($sizes$3 * 2)',
  height: 'calc($sizes$3 + 2px)',
  backgroundColor: '$secondary-dark',
  borderRadius: '$round',
  position: 'relative',
  boxShadow: '$sm',
  transition: 'background-color $fast',
  '-webkit-tap-highlight-color': '$primary',
  '&[data-state="checked"]': {
    backgroundColor: '$primary-dark',
  },
  '&:focus': {
    boxShadow: '$sm',
  },
});

export const Thumb = styled(Switch.Thumb, {
  display: 'block',
  width: 'calc($sizes$3 - 2px)',
  height: 'calc($sizes$3 - 2px)',
  backgroundColor: '$white',
  borderRadius: '$round',
  boxShadow: '$sm',
  transition: 'transform $fast',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': {
    transform: 'translateX($sizes$3)',
    backgroundColor: '$gray50',
  },
});
