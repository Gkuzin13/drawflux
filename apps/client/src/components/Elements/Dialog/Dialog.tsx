import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IoCloseOutline } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import * as Styled from './Dialog.styled';

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
        <Styled.Content>
          <Styled.Close>
            <IoCloseOutline size={ICON_SIZES.LARGE} />
          </Styled.Close>
          <Styled.Title>{title}</Styled.Title>
          <Styled.Description>{description}</Styled.Description>
        </Styled.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Dialog;
