import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import useDisclosure from '@/hooks/useDisclosure/useDisclosure';
import Dialog from '@/components/Elements/Dialog/Dialog';
import { createContext } from './createContext';

type ModalContextValue = {
  opened: boolean;
  content: ModalContent;
  open: (content: ModalContent) => void;
  close: () => void;
};

type ModalContent = {
  title: string;
  description: string;
};

export const [ModalContext, useModal] =
  createContext<ModalContextValue>('Modal');

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [opened, { open, close }] = useDisclosure();
  const [content, setContent] = useState<ModalContent>({
    title: '',
    description: '',
  });

  const openModal = (content: ModalContent) => {
    setContent(content);
    open();
  };

  return (
    <ModalContext.Provider value={{ opened, content, open: openModal, close }}>
      {children}
      <Dialog open={opened} {...content} onClose={close} />
    </ModalContext.Provider>
  );
};
