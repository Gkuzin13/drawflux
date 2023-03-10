import { MenuItem } from '@/client/shared/constants/menu';
import { createElement } from 'react';
import { ContextMenuButton, ContextMenuContainer } from './ContextMenuStyled';

type Props = {
  menuItems: MenuItem[];
  onAction: (key: MenuItem['key']) => void;
};

const NodeMenu = ({ menuItems, onAction }: Props) => {
  return (
    <ContextMenuContainer>
      {menuItems.map((item) => {
        return (
          <ContextMenuButton
            key={item.key}
            size="small"
            color="secondary-light"
            onClick={() => onAction(item.key)}
          >
            {item.name}
            {item.icon && createElement(item.icon)}
          </ContextMenuButton>
        );
      })}
    </ContextMenuContainer>
  );
};

export default NodeMenu;
