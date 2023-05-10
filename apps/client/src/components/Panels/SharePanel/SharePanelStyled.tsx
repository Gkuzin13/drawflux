import { styled } from 'shared';
import Menu from '@/components/core/Menu/Menu';

export const SharePanelContainer = styled('div', {
  position: 'fixed',
  right: '$12',
  top: '$2',
  maxWidth: '$11',
  zIndex: 1,
});

export const SharePanelDisclamer = styled('p', {
  padding: '$1 $2 $2 $2',
  fontSize: '$1',
  color: '$gray600',
});

export const SharePanelToggle = styled(Menu.Toggle, {
  maxHeight: '$6',
});
