import { styled } from 'shared';
import Button from '@/components/core/Button/Button';
import { ButtonStyled } from '@/components/core/Button/ButtonStyled';

export const ZoomPanelContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  left: '$2',
  bottom: '$1',
  zIndex: 1,
  padding: '$1',
  color: '$gray500',
  fontSize: '$2',
});

export const ZoomPanelButton = styled(ButtonStyled, {
  textShadow: '$small',
  '&:hover': {
    color: '$gray900',
  },
  defaultVariants: {
    size: 'extra-small',
  },
});
