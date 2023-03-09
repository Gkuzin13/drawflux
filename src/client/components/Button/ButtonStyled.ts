import { styled } from '@/client/shared/styles/theme';

export const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  border: '1px solid transparent',
  transitionProperty: 'background-color, color',
  transition: '$fast',
  lineHeight: '$normal',
  '&[disabled]': {
    opacity: 0.5,
    cursor: 'revert',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '$green500',
        color: '$white',
        '&:hover': {
          backgroundColor: '$green400',
        },
      },
      secondary: {
        backgroundColor: '$gray200',
        '&:hover': {
          backgroundColor: '$gray300',
        },
      },
      'secondary-light': {
        backgroundColor: '$gray50',
        '&:hover': {
          backgroundColor: '$gray100',
        },
      },
    },
    size: {
      'extra-small': {
        fontSize: '$1',
        padding: '$1',
      },
      small: {
        fontSize: '$2',
        padding: '$1 $2',
      },
      normal: {
        padding: '$2 $3',
      },
      large: {
        padding: '$3 $4',
      },
    },
    squared: {
      true: {
        aspectRatio: 1 / 1,
      },
    },
  },
});
