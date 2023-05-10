import { styled } from 'shared';

export const QRCodeBgImage = styled('div', {
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  variants: {
    size: {
      md: {
        width: '200px',
        height: '200px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
