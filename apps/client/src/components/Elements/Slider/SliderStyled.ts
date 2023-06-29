import * as Slider from '@radix-ui/react-slider';
import { styled } from 'shared';

export const SliderContainer = styled(Slider.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '100%',
  padding: '$1 0',
});

export const SliderTrack = styled(Slider.Track, {
  backgroundColor: '$gray200',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '$1',
  height: '$1',
});

export const SliderRange = styled(Slider.Range, {
  position: 'absolute',
  backgroundColor: '$green400',
  borderRadius: '$1',
  height: '100%',
});

export const SliderThumb = styled(Slider.Thumb, {
  display: 'block',
  width: '$3',
  height: '$3',
  backgroundColor: '$green500',
  boxShadow: '$small',
  borderRadius: '$round',
  transition: 'all $fast',
  '&:hover': {
    backgroundColor: '$green600',
  },
  '&:focus': {
    boxShadow: '$medium',
  },
});
