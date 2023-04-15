import { styled } from 'shared';

export const ToolsPanelContainer = styled('div', {
  position: 'fixed',
  bottom: '$2',
  right: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  zIndex: 1,
});

export const ToolsPanelRow = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$1',
  backgroundColor: '$gray50',
  pointerEvents: 'all',
  borderRadius: '$1',
  padding: '$1',
  boxShadow: '$small',
});
