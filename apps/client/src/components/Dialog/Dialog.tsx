import { Root, Portal } from '@radix-ui/react-dialog';
import { IoCloseOutline } from 'react-icons/io5';
import { ICON_SIZES } from '@/constants/icon';
import {
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from './DialogStyled';

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
    <Root open={open} onOpenChange={handleOpenChange}>
      <Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogCloseButton>
            <IoCloseOutline size={ICON_SIZES.LARGE} />
          </DialogCloseButton>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogContent>
      </Portal>
    </Root>
  );
};

export default Dialog;
