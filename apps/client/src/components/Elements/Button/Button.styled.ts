import { styled } from 'shared';

export const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  borderRadius: '$1',
  border: '1px solid transparent',
  transitionProperty: 'background-color, color',
  transition: '$fast',
  '&[disabled], &[data-disabled]': {
    opacity: 0.5,
    cursor: 'revert',
    backgroundColor: '$secondary',
  },
  variants: {
    color: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        '&:hover': {
          backgroundColor: '$primary-dark',
        },
        '&[data-highlighted]': {
          border: '1px $primary-dark solid',
        },
      },
      secondary: {
        backgroundColor: '$secondary',
        '&:hover': {
          backgroundColor: '$secondary-dark',
        },
        '&[data-highlighted]': {
          border: '1px $secondary-light solid',
        },
      },
      'secondary-light': {
        backgroundColor: '$secondary-light',
        '&:hover': {
          backgroundColor: '$secondary',
        },
        '&[data-highlighted]': {
          border: '1px $secondary-dark solid',
        },
      },
      'secondary-dark': {
        backgroundColor: '$secondary-dark',
        '&:hover': {
          backgroundColor: '$secondary-dark',
        },
        '&[data-highlighted]': {
          border: '1px $secondary solid',
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
      xs: {
        fontSize: '$1',
        gap: '$1',
        padding: '$1 $1',
      },
      sm: {
        fontSize: '$2',
        padding: '$1 $2',
      },
      md: {
        padding: '$2 $3',
      },
      lg: {
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
      size: 'xs',
      css: {
        padding: '$1',
        width: '$5',
        height: '$5',
      },
    },
    {
      squared: true,
      size: 'sm',
      css: {
        padding: '$1',
        width: '$6',
        height: '$6',
      },
    },
    {
      squared: true,
      size: 'md',
      css: {
        padding: '$1',
        width: '$7',
        height: '$7',
        flexShrink: 0,
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    align: 'center',
  },
});
