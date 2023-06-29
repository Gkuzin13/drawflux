import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from 'shared';
import { ButtonStyled } from '@/components/Elements/Button/ButtonStyled';

export const ContentGrid = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: '$5 $5 $5 $5',
  gap: '$1',
});

export const ColorButton = styled(RadioGroup.Item, ButtonStyled, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});
