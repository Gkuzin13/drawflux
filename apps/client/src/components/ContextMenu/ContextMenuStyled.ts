import * as ContextMenu from '@radix-ui/react-context-menu';
import { styled } from 'shared';
import { ButtonStyled } from '../core/Button/ButtonStyled';

export const ContextMenuContent = styled(ContextMenu.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  backgroundColor: '$gray50',
  borderRadius: '$1',
  boxShadow: '$small',
  padding: '$2',
  minWidth: '$11',
});

export const ContextMenuItem = styled(ContextMenu.Item, ButtonStyled, {
  userSelect: 'none',
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary-light',
    align: 'between',
  },
});