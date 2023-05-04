import { styled } from 'shared';
import { ButtonStyled } from '../Button/ButtonStyled';

export const MenuLabel = styled('div', {});

export const MenuItem = styled(ButtonStyled, {
  minWidth: '$9',
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary-light',
  },
});
