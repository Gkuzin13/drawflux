import * as ContextMenu from '@radix-ui/react-context-menu';
import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';

export const Content = styled(ContextMenu.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  backgroundColor: '$bg',
  borderRadius: '$2',
  boxShadow: '$sm',
  padding: '$2',
  minWidth: '$11',
  zIndex: 3,
});

export const Item = styled(ContextMenu.Item, ButtonStyled.Button, {
  userSelect: 'none',
  defaultVariants: {
    size: 'xs',
    color: 'secondary-light',
    align: 'between',
  },
});
