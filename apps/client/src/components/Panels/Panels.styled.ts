import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';

export const Container = styled('div', {
  position: 'fixed',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 1,
  padding: '$3',
});

export const Panel = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '$1',
  padding: '$1',
  pointerEvents: 'all',
  boxShadow: '$sm',
  borderRadius: '$2',
  backgroundColor: '$bg',
});

export const Button = styled(ButtonStyled.Button, {
  defaultVariants: {
    size: 'xs',
    color: 'secondary',
    squared: true,
  },
});

export const TopPanel = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  width: '100%',
  gap: '$2',
});

export const TopPanelRightContainer = styled(Panel);

export const BottomPanel = styled('div', {
  position: 'relative',
  display: 'grid',
  placeItems: 'end center',
  gap: '$2',
  variants: {
    direction: {
      column: {
        gridTemplateColumns: 'repeat(1, 1fr)',
      },
      row: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
    },
  },
});
