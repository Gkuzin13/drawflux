import Drawer from '../Drawer/Drawer';
import { styled } from 'shared';
import { Button } from '../Button/Button.styled';

export const Content = styled(Drawer.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  maxWidth: 'calc((64px * 4) + ($4 * 2) + $2)',
  padding: '$4',
});

export const Trigger = styled(Drawer.Trigger, Button, {
  gap: '$1',
  defaultVariants: {
    size: 'sm',
    color: 'secondary',
    align: 'between',
  },
});

export const ItemsSection = styled('div', {
  width: '100%'
});

export const Items = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$2',
  overflowY: 'auto',
  maxHeight: 'calc(100% / 1.25)',
  padding: '$4 0',
});

export const removeButton = styled(Button, {
  defaultVariants: {
    squared: true,
    size: 'sm',
    color: 'danger',
  },
});

export const Title = styled('h3', {
  fontSize: '$3',
  fontWeight: 'bold',
});

export const Empty = styled('div', {
  textAlign: 'center',
  fontSize: '$2',
  color: '$gray500',
});
