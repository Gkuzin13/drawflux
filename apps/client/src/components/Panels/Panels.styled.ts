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
  boxShadow: '$small',
  borderRadius: '$1',
  backgroundColor: '$white50',
});

export const Button = styled(ButtonStyled.Button, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});

export const TopPanel = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: '$2',
});

export const TopPanelRightContainer = styled(Panel, {});

export const BottomPanel = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});
