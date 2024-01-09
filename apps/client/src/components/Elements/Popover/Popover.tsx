import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as Styled from './Popover.styled';

const Popover = ({ children, ...props }: PopoverPrimitive.PopoverProps) => {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
};

Popover.Trigger = PopoverPrimitive.Trigger;
Popover.Content = Styled.Content;
Popover.Portal = PopoverPrimitive.Portal;

export default Popover;
