import { createStitches } from '@stitches/react';

export const { styled, css } = createStitches({
  theme: {
    colors: {
      black: '#FFF',
      gray300: '#E0E0E0',
      gray400: '#BDBDBD',
      blue900: '#0D47A1',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
    },
  },
});
