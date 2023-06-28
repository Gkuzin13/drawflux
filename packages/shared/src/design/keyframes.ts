import { keyframes } from '@stitches/react';

export const slideLeft = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
});

export const hide = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});
