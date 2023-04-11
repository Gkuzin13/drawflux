import { styled } from '@shared';
import { keyframes } from '@stitches/react';
import { TbLoader2 } from 'react-icons/tb';

const dash = keyframes({
  '0%': {
    transform: 'rotate(360deg)',
    strokeDasharray: '0, 200',
    strokeDashoffset: '0',
  },

  '50%': {
    strokeDasharray: '89, 200',
    strokeDashoffset: '-15',
  },

  '100%': {
    strokeDasharray: '0, 200',
    strokeDashoffset: '-100',
  },
});

export const LoaderContainer = styled('div', {
  display: 'grid',
  placeItems: 'center',
  variants: {
    fullScreen: {
      true: {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '$white50',
        zIndex: 1050,
      },
    },
  },
});

export const LoaderInnerContainer = styled('div', {
  display: 'flex',
  placeItems: 'center',
  gap: '$2',
});

export const LoaderSinner = styled(TbLoader2, {
  '& path:nth-of-type(2)': {
    transformOrigin: 'center',
    animation: `${dash} 1s cubic-bezier(0.5, 0.46, 0.45, 0.25) infinite`,
  },
});
