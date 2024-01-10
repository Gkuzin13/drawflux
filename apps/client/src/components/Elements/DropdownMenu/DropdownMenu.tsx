import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as Styled from './DropdownMenu.styled';

type DropdownMenuProps = DropdownMenuPrimitive.DropdownMenuProps;

const Root = ({ children, ...props }: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
};

Root.Portal = DropdownMenuPrimitive.Portal;
Root.Trigger = Styled.Trigger;
Root.Content = Styled.Content;
Root.Item = Styled.Item;

export default Root;
