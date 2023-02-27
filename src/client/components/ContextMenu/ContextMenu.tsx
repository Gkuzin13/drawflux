import { MenuItem } from '@/client/shared/menu';
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
          <div key={item.key}>
            <ContextMenuButton type="button" onClick={() => onAction(item.key)}>
              {item.name}
              {item.icon && createElement(item.icon)}
            </ContextMenuButton>
          </div>
        );
      })}
    </ContextMenuContainer>
  );
};

export default NodeMenu;
