import { ICON_SIZES } from '@/client/shared/styles/theme';
import { IoCloseOutline } from 'react-icons/io5';
import { Divider } from '../Divider/Divider';
import {
  ModalCloseButton,
  ModalContainer,
  ModalDialog,
  ModalDialogContent,
  ModalDialogTitle,
} from './ModalStyled';

type Props = {
  title: string;
  message: string;
  onClose: () => void;
};

const Modal = ({ title, message, onClose }: Props) => {
  return (
    <ModalContainer>
      <ModalDialog>
        <ModalCloseButton size="large" onClick={onClose}>
          <IoCloseOutline size={ICON_SIZES.EXTRA_LARGE} />
        </ModalCloseButton>
        <ModalDialogTitle>{title}</ModalDialogTitle>
        <Divider type="horizontal" />
        <ModalDialogContent>{message}</ModalDialogContent>
      </ModalDialog>
    </ModalContainer>
  );
};

export default Modal;
