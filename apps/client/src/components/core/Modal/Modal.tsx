import { useClickAway } from '@/hooks/useClickAway';
import { ICON_SIZES } from '@/constants/icon';
import { useRef } from 'react';
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useClickAway(dialogRef, onClose);

  return (
    <ModalContainer>
      <ModalDialog ref={dialogRef}>
        <ModalCloseButton title="Close" onClick={onClose}>
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
