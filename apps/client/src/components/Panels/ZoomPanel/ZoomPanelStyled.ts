import { styled } from 'shared';
import Button from '@/components/core/Button/Button';

export const ZoomPanelContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$1',
  position: 'fixed',
  left: '$2',
  bottom: '$1',
  zIndex: 1,
  padding: '$1',
  color: '$gray500',
  fontSize: '$2',
});

export const ZoomPanelButton = styled(Button, {
  padding: '$1',
  textShadow: '$small',
  '&:hover': {
    color: '$gray900',
  },
});
