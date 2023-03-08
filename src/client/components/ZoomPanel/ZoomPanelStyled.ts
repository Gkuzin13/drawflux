import { styled } from '@stitches/react';

export const ZoomPanelContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  left: '0.5rem',
  bottom: '0.5rem',
  zIndex: 1,
  padding: '0.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
});

export const ZoomPanelValue = styled('span', {
  color: 'black',
});
