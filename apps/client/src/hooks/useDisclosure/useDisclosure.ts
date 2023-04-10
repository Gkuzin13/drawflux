import { useState } from 'react';

export type UseDisclosureReturn = [
  boolean,
  { open: () => void; close: () => void; toggle: () => void },
];

const useDisclosure = (initialState = false): UseDisclosureReturn => {
  const [opened, setOpened] = useState(initialState);

  const open = () => {
    setOpened((prevState) => {
      return prevState ? prevState : true;
    });
  };

  const close = () => {
    setOpened((prevState) => {
      return !prevState ? prevState : false;
    });
  };

  const toggle = () => {
    opened ? close() : open();
  };

  return [opened, { open, close, toggle }];
};

export default useDisclosure;
