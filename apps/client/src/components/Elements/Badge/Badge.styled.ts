import { styled } from 'shared';

export const Container = styled('div', {
  position: 'relative',
  flexShrink: 0,
  width: 'fit-content',
});

export const Content = styled('span', {
  position: 'absolute',
  display: 'grid',
  placeItems: 'center',
  lineHeight: 0,
  zIndex: 1,
  width: '$3',
  height: '$3',
  textAlign: 'center',
  fontSize: '$1',
  borderRadius: '$round',
  variants: {
    placement: {
      'top-left': {
        top: 0,
        left: 0,
        transform: 'translate(-25%, -25%)',
      },
      'top-right': {
        top: 0,
        right: 0,
        transform: 'translate(25%, -25%)',
      },
      'bottom-right': {
        bottom: 0,
        right: 0,
        transform: 'translate(25%, 25%)',
      },
      'bottom-left': {
        bottom: 0,
        left: 0,
        transform: 'translate(-25%, 25%)',
      },
    },
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
      },
      secondary: {
        backgroundColor: '$secondary',
      },
    },
    invisible: {
      true: {
        display: 'none',
      },
    },
  },
  defaultVariants: {
    placement: 'top-right',
    color: 'primary',
  },
});
