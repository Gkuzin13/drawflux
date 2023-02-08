import { MenuItem } from '@/shared/constants/base';
import { Container, Dropdown } from '@nextui-org/react';
import { Key } from 'react';

type Props = {
  isOpen: boolean;
  menuItems: MenuItem[];
  x: number;
  y: number;
  onClose: () => void;
  onAction: (key: Key) => void;
};

const NodeMenu = ({ isOpen, x, y, menuItems, onClose, onAction }: Props) => {
  return (
    <Container>
      <Dropdown isOpen={isOpen} closeOnSelect onClose={onClose} offset={36}>
        <Dropdown.Button
          disabled
          css={{
            position: 'fixed',
            top: `${y}px`,
            left: `${x + 96}px`,
            visibility: 'hidden',
          }}
        ></Dropdown.Button>
        <Dropdown.Menu onAction={onAction} aria-label="Actions">
          <Dropdown.Section title="Actions">
            {menuItems.map((item) => {
              return (
                <Dropdown.Item key={item.key} color={item.color}>
                  {item.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};

export default NodeMenu;
