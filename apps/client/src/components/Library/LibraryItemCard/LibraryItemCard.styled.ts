import { styled } from 'shared';
import CheckboxCore from '@/components/Elements/Checkbox/Checkbox';

export const Checkbox = styled(CheckboxCore, {
  position: 'absolute',
  top: '$1',
  right: '$1',
  zIndex: 1,
  '&[data-state="unchecked"]': {
    visibility: 'hidden',
  },
});

export const Container = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  padding: '$1',
  borderRadius: '$1',
  overflow: 'hidden',
  outline: '1px transparent solid',
  '&:hover': {
    outline: '1px $secondary-dark solid',
    boxShadow: '$md',
  },
  [`&:hover ${Checkbox}[data-state="unchecked"]`]: {
    visibility: 'visible',
  },
});
