import type { ContextMenuItem } from '@/constants/menu';
import Menu from '../core/Menu/Menu';

type Props = {
  items: ContextMenuItem[];
  onAction: (key: ContextMenuItem['key']) => void;
};

const NodeMenu = ({ items, onAction }: Props) => {
  return (
    <Menu.Dropdown opened={true}>
      {items.map((item) => {
        return (
          <Menu.Item
            key={item.key}
            title={item.name}
            fullWidth={true}
            spanned={true}
            size="small"
            color="secondary-light"
            onItemClick={() => onAction(item.key)}
          >
            {item.name}
            {item.icon && item.icon({})}
          </Menu.Item>
        );
      })}
    </Menu.Dropdown>
  );
};

export default NodeMenu;
