import { styled } from 'shared';
import * as Checkbox from '@radix-ui/react-checkbox';

export const Root = styled(Checkbox.Root, {
  backgroundColor: '$bg',
  width: '$4',
  height: '$4',
  border: '1px $gray400 solid',
  borderRadius: '$1',
  display: 'grid',
  placeItems: 'center',
  boxShadow: '$sm',
  transition: 'background-color $normal',
  '&:hover, &:focus': { boxShadow: '$md' },
  '&[data-state="checked"]': {
    backgroundColor: '$primary',
    borderColor: '$primary',
  }
});

export const Indicator = styled(Checkbox.Indicator, {
  display: 'flex',
  color: '$bg',
});
