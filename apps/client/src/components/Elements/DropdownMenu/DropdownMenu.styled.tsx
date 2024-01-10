import { styled } from 'shared';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { Button } from '../Button/Button.styled';

export const Content = styled(DropdownPrimitive.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  padding: '$1',
  boxShadow: '$sm',
  borderRadius: '$2',
  backgroundColor: '$bg',
});

export const Trigger = styled(DropdownPrimitive.Trigger, Button, {
  defaultVariants: {
    size: 'xs',
    color: 'secondary',
    squared: true,
  },
});

export const Item = styled(DropdownPrimitive.Item, Button, {
  userSelect: 'none',
  outline: 'none',
  defaultVariants: {
    size: 'xs',
    align: 'start',
    color: 'secondary-light',
  },
});
