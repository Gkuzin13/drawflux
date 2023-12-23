import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as Styled from './Drawer.styled';
import type { ComponentProps } from '@stitches/react';

type DrawerProps = {
  onClose?: () => void;
  children: React.ReactNode;
} & Pick<DialogPrimitive.DialogProps, 'modal' | 'open' | 'defaultOpen'>;

type ContentProps = ComponentProps<(typeof Styled)['Content']>;

const Drawer = ({ onClose, children, ...restProps }: DrawerProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose && onClose();
    }
  };

  return (
    <DialogPrimitive.Root onOpenChange={handleOpenChange} {...restProps}>
      {children}
    </DialogPrimitive.Root>
  );
};

const Content = ({ children, ...props }: ContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <Styled.Content {...props}>{children}</Styled.Content>
    </DialogPrimitive.Portal>
  );
};

Drawer.Content = Content;
Drawer.Header = Styled.Header;
Drawer.Title = Styled.Title;
Drawer.Close = Styled.Close;
Drawer.Trigger = Styled.Trigger;

export default Drawer;
