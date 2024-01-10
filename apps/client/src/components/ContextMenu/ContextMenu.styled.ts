import * as ContextMenu from '@radix-ui/react-context-menu';
import { styled } from 'shared';
import { Button } from '@/components/Elements/Button/Button.styled';

export const Content = styled(ContextMenu.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  backgroundColor: '$bg',
  borderRadius: '$2',
  boxShadow: '$sm',
  padding: '$1',
  minWidth: '$11',
  zIndex: 3,
});

export const Item = styled(ContextMenu.Item, Button, {
  userSelect: 'none',
  defaultVariants: {
    size: 'xs',
    color: 'secondary-light',
    align: 'between',
  },
});
