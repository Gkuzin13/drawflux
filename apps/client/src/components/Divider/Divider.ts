import { styled } from '@shared';

export const Divider = styled('div', {
  backgroundColor: '$gray300',
  variants: {
    type: {
      horizontal: {
        height: '1px',
        width: '100%',
        margin: '$2 auto',
      },
      vertical: {
        width: '1px',
        height: '$4',
      },
    },
  },
  defaultVariants: {
    type: 'vertical',
  },
});
