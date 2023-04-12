import { useContext } from 'react';
import type { Attributes, PropsWithChildren, ReactNode } from 'react';
import Button from '../Button/Button';
import type { ButtonStyled } from '../Button/ButtonStyled';
import { Divider } from '../Divider/Divider';
import Popover from '../Popover/Popover';
import { PopoverContext } from '../Popover/PopoverContext';

type ItemProps = {
  closeOnItemClick?: boolean;
  onItemClick: () => void;
} & PropsWithChildren<typeof ButtonStyled.defaultProps>;

type MenuProps = {
  children: ReactNode[];
} & Attributes;

const Label = ({ children, ...props }: PropsWithChildren<Attributes>) => {
  return <div {...props}>{children}</div>;
};

const Item = ({
  onItemClick,
  closeOnItemClick = true,
  children,
  ...props
}: ItemProps) => {
  const ctx = useContext(PopoverContext);

  const hanleClick = () => {
    onItemClick();
    closeOnItemClick && ctx?.close();
  };

  return (
    <Button {...props} onClick={hanleClick}>
      {children}
    </Button>
  );
};

const Menu = ({ children, ...props }: MenuProps) => {
  return <Popover {...props}>{children}</Popover>;
};

Menu.Dropdown = Popover.Dropdown;
Menu.Toggle = Popover.Toggle;
Menu.Label = Label;
Menu.Item = Item;
Menu.Divider = Divider;

export default Menu;
