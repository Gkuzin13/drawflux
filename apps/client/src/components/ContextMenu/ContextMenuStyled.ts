import { styled } from 'shared';
import Menu from '../core/Menu/Menu';

export const ContextMenuContainer = styled(Menu.Dropdown, {
  width: '$5',
  backgroundColor: 'red',
});

export const ContextMenuItem = styled(Menu.Item, {
  paddingRight: '$2',
});
