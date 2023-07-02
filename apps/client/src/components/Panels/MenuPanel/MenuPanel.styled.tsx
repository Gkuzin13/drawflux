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
  boxShadow: '$small',
  borderRadius: '$1',
  marginTop: '$2',
  minWidth: '$11',
  backgroundColor: '$white50',
});

export const Item = styled(DropdownMenuPrimitive.Item, ButtonStyled.Button, {
  justifyContent: 'start',
  gap: '$1',
  padding: '$1',
  userSelect: 'none',
  outline: 'none',
  defaultVariants: {
    size: 'extra-small',
    align: 'start',
    color: 'secondary-light',
  },
});
