import { styled } from '@/client/shared/styles/theme';
import Button from '@/client/components/Button/Button';

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

export const ZoomPanelValue = styled('span', {});

export const ZoomPanelButton = styled(Button, {
  padding: '$1',
  '&:hover': {
    color: '$gray900',
  },
});
