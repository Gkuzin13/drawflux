import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled } from 'shared';
import { ButtonStyled } from '@/components/core/Button/ButtonStyled';
import { Panel } from '../PanelsStyled';

export const MenuPanelTrigger = styled(
  DropdownMenu.Trigger,
  ButtonStyled,
  Panel,
  {
    width: '$6',
    height: '$6',
    defaultVariants: {
      size: 'extra-small',
    },
  },
);

export const DropdownMenuContent = styled(DropdownMenu.Content, {
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

export const DropdownMenuItem = styled(DropdownMenu.Item, ButtonStyled, {
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
