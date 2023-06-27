import { styled } from 'shared';
import { ButtonStyled } from '../core/Button/ButtonStyled';

export const PanelsContainer = styled('div', {
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

export const PanelButton = styled(ButtonStyled, {
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
