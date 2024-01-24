import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as Styled from './Dialog.styled';
import Icon from '../Icon/Icon';

type Props = {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
};

const Dialog = ({ title, description, open, onClose }: Props) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <Styled.Overlay />
        <Styled.Content data-testid="dialog-content">
          <Styled.Close data-testid="close-dialog-button">
            <Icon name="x" size="lg" />
          </Styled.Close>
          <Styled.Title>{title}</Styled.Title>
          <Styled.Description>{description}</Styled.Description>
        </Styled.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Dialog;
