import { styled } from '@stitches/react';

export const ContextMenuContainer = styled('div', {
  position: 'fixed',
  width: '200px',
  zIndex: 999,
  backgroundColor: 'white',
  boxShadow: '0px 1px 1px black',
  borderRadius: '16px',
});

export const ContextMenuButton = styled('button', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});
