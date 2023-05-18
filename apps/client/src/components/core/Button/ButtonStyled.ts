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
        '&[data-highlighted]': {
          border: '1px $green400 solid',
        },
      },
      secondary: {
        backgroundColor: '$gray200',
        '&:hover': {
          backgroundColor: '$gray300',
        },
        '&[data-highlighted]': {
          border: '1px $gray300 solid',
        },
      },
      'secondary-light': {
        backgroundColor: '$gray50',
        '&:hover': {
          backgroundColor: '$gray200',
        },
        '&[data-highlighted]': {
          border: '1px $gray300 solid',
        },
      },
    },
    align: {
      start: {
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
      },
      between: {
        justifyContent: 'space-between',
      },
    },
    size: {
      'extra-small': {
        fontSize: '$1',
        gap: '$1',
        padding: '$1 $1',
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
      true: {},
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
  compoundVariants: [
    {
      squared: true,
      size: 'extra-small',
      css: {
        padding: '$1',
        width: '$5',
        height: '$5',
      },
    },
    {
      squared: true,
      size: 'small',
      css: {
        padding: '$1',
        width: '$6',
        height: '$6',
      },
    },
    {
      squared: true,
      size: 'normal',
      css: {
        padding: '$1',
        width: '$7',
        height: '$7',
      },
    },
  ],
  defaultVariants: {
    size: 'normal',
    align: 'center',
  },
});
