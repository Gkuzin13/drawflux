import { useCallback, useState } from 'react';
import useDisclosure from '@/hooks/useDisclosure/useDisclosure';
import Dialog from '@/components/Elements/Dialog/Dialog';
import { createContext } from './createContext';

type ModalContextValue = {
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
};

type ModalContent = {
  title: string;
  description: string;
};

export const [ModalContext, useModal] =
  createContext<ModalContextValue>('Modal');

export const ModalProvider = ({ children }: React.PropsWithChildren) => {
  const [opened, { open, close }] = useDisclosure();
  const [content, setContent] = useState<ModalContent>({
    title: '',
    description: '',
  });

  const openModal = useCallback(
    (content: ModalContent) => {
      setContent(content);
      open();
    },
    [open],
  );

  const closeModal = useCallback(() => close(), [close]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Dialog open={opened} {...content} onClose={close} />
    </ModalContext.Provider>
  );
};
