import { keyframes } from '@stitches/react';
import { styled } from 'shared';
import Icon from '../Icon/Icon';

const dash = keyframes({
  '0%': {
    transform: 'rotate(360deg)',
    strokeDasharray: '0, 200',
    strokeDashoffset: '0',
  },

  '50%': {
    strokeDasharray: '100, 100',
    strokeDashoffset: '-15',
  },

  '100%': {
    strokeDasharray: '0, 200',
    strokeDashoffset: '-75',
  },
});

export const Container = styled('div', {
  display: 'grid',
  placeItems: 'center',
  variants: {
    fullScreen: {
      true: {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1050,
        backdropFilter: 'blur(5px)',
      },
    },
    filled: {
      true: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      },
    },
  },
});

export const InnerContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  color: '$black',
});

export const Spinner = styled(Icon, {
  '& path:nth-of-type(2)': {
    transformOrigin: 'center',
    animation: `${dash} 1.5s linear infinite`,
  },
});
