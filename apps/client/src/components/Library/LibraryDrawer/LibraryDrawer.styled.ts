import Drawer from '@/components/Elements/Drawer/Drawer';
import { styled } from 'shared';

export const Content = styled(Drawer.Content, {
  display: 'grid',
  gridAutoRows: 'min-content min-content 1fr',
  gap: '$4',
  width: '100%',
  maxWidth: 'calc((64px * 4) + ($4 * 2) + $2)',
  padding: '$4',
});

export const ItemsSection = styled('div', {
  position: 'relative',
  overflowY: 'auto',
  '-ms-overflow-style': 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export const ItemsHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: '$bg',
  padding: '$2 0',
});

export const Items = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$2',
});
