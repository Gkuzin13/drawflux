import { styled } from 'shared';
import { ButtonStyled } from '@/components/core/Button/ButtonStyled';

export const ZoomPanelContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  zIndex: 1,
  padding: '$1',
  color: '$gray500',
  fontSize: '$2',
  variants: {
    position: {
      bottomLeft: {
        bottom: '$1',
        left: '$1',
      },
    },
  },
  defaultVariants: {
    position: 'bottomLeft',
  },
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
