import Drawer from '../Drawer/Drawer';
import { styled } from 'shared';
import { Button } from '../Button/Button.styled';

export const Content = styled(Drawer.Content, {
  maxWidth: 'calc((64px * 4) + ($4 * 2) + 8px)',
});

export const Trigger = styled(Drawer.Trigger, Button, {
  gap: '$1',
  defaultVariants: {
    size: 'sm',
    color: 'secondary',
    align: 'between',
  },
});

export const Items = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$2',
  overflowY: 'auto',
  maxHeight: 'calc(100% / 1.25)',
});

export const removeButton = styled(Button, {
  margin: '$1 0 $1 0',
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

export const ItemsHeader = styled(Drawer.Header, {
  margin: '$4 0 $2 0',
});

export const Empty = styled('div', {
  textAlign: 'center',
  fontSize: '$2',
  color: '$gray500',
});
