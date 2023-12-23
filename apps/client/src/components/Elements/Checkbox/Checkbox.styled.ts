import { styled } from 'shared';
import * as Checkbox from '@radix-ui/react-checkbox';

export const Root = styled(Checkbox.Root, {
  backgroundColor: '$bg',
  border: '1px $gray400 solid',
  display: 'flex',
  justifyContent: 'center',
  placeItems: 'center',
  boxShadow: '$sm',
  transition: 'background-color $normal',
  '&:hover, &:focus': { boxShadow: '$md' },
  '&[data-state="checked"]': {
    backgroundColor: '$primary',
    borderColor: '$primary',
  },
  variants: {
    size: {
      sm: {
        width: '$3',
        height: '$3',
        borderRadius: '$1',
      },
      md: {
        width: '$4',
        height: '$4',
        borderRadius: '$2',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Indicator = styled(Checkbox.Indicator, {
  display: 'flex',
  color: '$bg',
});
