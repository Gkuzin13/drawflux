import { useContext } from 'react';
import type { PropsWithChildren } from 'react';
import type { ButtonStyled } from '../Button/ButtonStyled';
import { Divider } from '../Divider/Divider';
import Popover, { type PopoverProps } from '../Popover/Popover';
import { PopoverContext } from '../Popover/PopoverContext';
import { MenuItem, MenuLabel } from './MenuStyled';

type ItemProps = {
  closeOnItemClick?: boolean;
  onItemClick: () => void;
} & PropsWithChildren<typeof ButtonStyled.defaultProps>;

type MenuProps = PopoverProps;

type LabelProps = PropsWithChildren<typeof MenuLabel.defaultProps>;

const Label = ({ children, ...props }: LabelProps) => {
  return <MenuLabel {...props}>{children}</MenuLabel>;
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
    <MenuItem {...props} onClick={hanleClick}>
      {children}
    </MenuItem>
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
