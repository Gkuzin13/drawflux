import { createStitches } from '@stitches/react';

export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  white50: '#FDFDFD',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray900: '#212121',
  green300: '#81C784',
  green400: '#66BB6A',
  green500: '#4CAF50',
  green600: '#43A047',
  blue600: '#1E88E5',
  blue700: '#1976D2',
  'deep-orange600': '#FB8C00',
  yellow600: '#FDD835',
  teal600: '#00897B',
  'light-blue600': '#039BE5',
  indigo600: '#3949AB',
  'deep-purple600': '#5E35B1',
  pink600: '#D81B60',
  red600: '#E53935',
} as const;

export const { theme, styled, css } = createStitches({
  theme: {
    colors,
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '60px',
    },
    sizes: {
      1: '4px',
      2: '8px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '36px',
      7: '48px',
      8: '64px',
      9: '96px',
      10: '128px',
      11: '192px',
      12: '250px',
    },
    fontSizes: {
      1: '12px',
      2: '14px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '36px',
    },
    radii: {
      1: '8px',
      2: '16px',
      round: '500px',
    },
    shadows: {
      small: '0px 2px 8px 0px $colors$gray300',
    },
    lineHeights: {
      normal: 1.5,
    },
    transitions: {
      normal: '0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',
      fast: '0.1s cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
  },
});

export const ICON_SIZES = {
  SMALL: 16,
  MEDIUM: 18,
  LARGE: 20,
  EXTRA_LARGE: 24,
} as const;
