import { styled } from '@stitches/react';

export const ControlPanelContainer = styled('div', {
  position: 'fixed',
  top: '$2',
  left: '$2',
  zIndex: 1,
});

export const ControlPanelRow = styled('div', {
  display: 'flex',
  gap: '$1',
  borderRadius: '$1',
  padding: '$1',
  boxShadow: '$small',
  backgroundColor: '$gray50',
});
