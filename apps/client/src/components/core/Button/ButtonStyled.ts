import { styled } from 'shared';

export const ButtonStyled = styled('button', {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '$1',
  border: '1px solid transparent',
  transitionProperty: 'background-color, color',
  transition: '$fast',
  lineHeight: '$normal',
  '&[disabled]': {
    opacity: 0.5,
    cursor: 'revert',
    backgroundColor: '$gray100',
    '&:hover': {
      backgroundColor: '$gray100',
    },
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
        gap: '$1',
        padding: '$1',
      },
      small: {
        fontSize: '$2',
        gap: '$2',
        padding: '$1 $2',
      },
      normal: {
        gap: '$3',
        padding: '$2 $3',
      },
      large: {
        gap: '$4',
        padding: '$3 $4',
      },
    },
    squared: {
      true: {
        aspectRatio: 1 / 1,
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    spanned: {
      true: {
        justifyContent: 'space-between',
      },
    },
  },
});
