import { styled } from '@stitches/react';

export const DockContainer = styled('div', {
  position: 'fixed',
  right: '1rem',
  maxWidth: '150px',
  zIndex: 999,
  backgroundColor: 'white',
  boxShadow: '0px 1px 1px black',
  borderRadius: '16px',
});

export const StyleButton = styled('button', {
  padding: '0.25rem',
});

export const ColorPicker = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(4, 1fr)',
  gap: '0.5rem',
  padding: '0.5rem',
  placeItems: 'center',
});

export const ColorCircle = styled('button', {
  borderRadius: '500px',
  width: '24px',
  height: '24px',
  padding: 0,
});
