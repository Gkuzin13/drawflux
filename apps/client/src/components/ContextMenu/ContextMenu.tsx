import type { ContextMenuItem } from '@/constants/menu';
import { ContextMenuButton, ContextMenuContainer } from './ContextMenuStyled';

type Props = {
  items: ContextMenuItem[];
  onAction: (key: ContextMenuItem['key']) => void;
};

const NodeMenu = ({ items, onAction }: Props) => {
  return (
    <ContextMenuContainer>
      {items.map((item) => {
        return (
          <ContextMenuButton
            key={item.key}
            title={item.name}
            size="small"
            color="secondary-light"
            onClick={() => onAction(item.key)}
          >
            {item.name}
            {item.icon && item.icon({})}
          </ContextMenuButton>
        );
      })}
    </ContextMenuContainer>
  );
};

export default NodeMenu;
