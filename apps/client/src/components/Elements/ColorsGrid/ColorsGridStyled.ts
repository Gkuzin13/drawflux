import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';

export const Grid = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: '$5 $5 $5 $5',
  gap: '$1',
});

export const Color = styled(RadioGroupPrimitive.Item, ButtonStyled, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});
