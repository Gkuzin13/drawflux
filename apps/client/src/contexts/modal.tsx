import { createContext, useContext, useState } from 'react';
import type { PropsWithChildren } from 'react';
import useDisclosure from '@/hooks/useDisclosure/useDisclosure';

type ModalContextValue = {
  opened: boolean;
  title: string;
  description: string;
  open: (title: string, description: string) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextValue>({
  opened: false,
  title: '',
  description: '',
  open: () => null,
  close: () => null,
});

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [opened, { open, close }] = useDisclosure();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const openModal = (title: string, description: string) => {
    setTitle(title);
    setDescription(description);
    open();
  };

  return (
    <ModalContext.Provider
      value={{ opened, title, description, open: openModal, close }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);

  if (ctx === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return ctx;
};
