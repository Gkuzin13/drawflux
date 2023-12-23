import { styled } from 'shared';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const Input = styled('input', {
  borderRadius: '$2',
  border: '1px solid $gray200',
  padding: '$1 $2',
  backgroundColor: '$secondary-light',
  '&:focus': {
    outline: 'none',
    borderColor: '$green300',
  },
});
