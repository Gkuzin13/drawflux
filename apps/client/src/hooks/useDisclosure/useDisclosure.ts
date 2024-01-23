import { useState } from 'react';

export type UseDisclosureReturn = [
  boolean,
  { open: () => void; close: () => void; toggle: () => void },
];

const useDisclosure = (initialState = false): UseDisclosureReturn => {
  const [opened, setOpened] = useState(initialState);

  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const toggle = () => setOpened((prevOpened) => !prevOpened);

  return [opened, { open, close, toggle }];
};

export default useDisclosure;
