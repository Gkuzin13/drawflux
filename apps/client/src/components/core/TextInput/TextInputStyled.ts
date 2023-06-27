import { styled } from 'shared';

export const TextInputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const Input = styled('input', {
  borderRadius: '$1',
  border: '1px solid $gray200',
  padding: '$2 $2',
  backgroundColor: '$white',
  '&:focus': {
    outline: 'none',
    borderColor: '$green300',
  },
});
