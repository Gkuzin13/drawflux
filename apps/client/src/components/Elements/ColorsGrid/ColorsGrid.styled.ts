import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';
import RadioGroup from '../RadioGroup/RadioGroup';

export const Grid = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: '$5 $5 $5 $5',
  gap: '$1',
});

export const Color = styled(RadioGroup.Item, ButtonStyled.Button, {
  defaultVariants: {
    size: 'xs',
    color: 'secondary',
    squared: true,
  },
});
