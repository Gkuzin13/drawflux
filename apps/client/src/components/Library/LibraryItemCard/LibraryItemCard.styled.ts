import { styled } from 'shared';
import CheckboxCore from '@/components/Elements/Checkbox/Checkbox';

export const Checkbox = styled(CheckboxCore, {
  position: 'absolute',
  top: '$1',
  right: '$1',
  zIndex: 1,
  '&[data-state="unchecked"]': {
    display: 'none',
  },
});

export const Container = styled('div', {
  cursor: 'pointer',
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  padding: '$1',
  width: '$8',
  height: '$8',
  borderRadius: '$2',
  overflow: 'hidden',
  border: '1px transparent solid',
  '&:hover': {
    borderColor: '$primary-dark',
  },
  [`&:hover ${Checkbox}[data-state="unchecked"]`]: {
    display: 'initial',
  },
});
