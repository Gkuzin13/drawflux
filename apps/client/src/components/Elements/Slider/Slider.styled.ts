import * as SliderPrimitive from '@radix-ui/react-slider';
import { styled } from 'shared';

export const Container = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '100%',
  padding: '$1 0',
});

export const Track = styled(SliderPrimitive.Track, {
  backgroundColor: '$secondary-dark',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '$1',
  height: '$1',
});

export const Range = styled(SliderPrimitive.Range, {
  position: 'absolute',
  backgroundColor: '$green400',
  borderRadius: '$1',
  height: '100%',
});

export const Thumb = styled(SliderPrimitive.Thumb, {
  display: 'block',
  width: '$3',
  height: '$3',
  backgroundColor: '$green500',
  boxShadow: '$sm',
  borderRadius: '$round',
  transition: 'all $fast',
  '&:hover': {
    backgroundColor: '$green600',
  },
  '&:focus': {
    boxShadow: '$medium',
  },
});
