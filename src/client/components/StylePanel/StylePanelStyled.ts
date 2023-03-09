import { styled } from '@/client/shared/styles/theme';

export const StylePanelContainer = styled('div', {
  position: 'fixed',
  right: '$2',
  top: '$2',
  zIndex: 1,
  boxShadow: '$small',
  borderRadius: '$1',
  padding: '$1',
});

export const StylePanelRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  padding: '$1 0',
  gap: '$1',
});

export const ColorPicker = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  gap: '$2',
  padding: '$1 0',
});

export const ColorCircle = styled('div', {
  borderRadius: '$round',
  width: '$3',
  height: '$3',
});
