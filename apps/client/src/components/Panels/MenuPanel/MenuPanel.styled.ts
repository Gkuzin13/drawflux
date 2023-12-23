import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';
import * as PanelStyled from '../Panels.styled';

export const Trigger = styled(
  DropdownMenuPrimitive.Trigger,
  PanelStyled.Button,
  {
    defaultVariants: {},
  },
);

export const Content = styled(DropdownMenuPrimitive.Content, {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  padding: '$2',
  boxShadow: '$sm',
  borderRadius: '$2',
  marginTop: '$2',
  minWidth: '$11',
  backgroundColor: '$bg',
});

export const Item = styled(DropdownMenuPrimitive.Item, ButtonStyled.Button, {
  padding: '$1',
  userSelect: 'none',
  outline: 'none',
  defaultVariants: {
    size: 'xs',
    align: 'start',
    color: 'secondary-light',
  },
});
