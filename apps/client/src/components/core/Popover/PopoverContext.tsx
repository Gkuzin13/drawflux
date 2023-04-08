import { createContext } from 'react';
import { UseDisclosureReturn } from '@/hooks/useDisclosure';

export type PopoverContextObject = {
  opened: boolean;
  toggle: UseDisclosureReturn[1]['toggle'];
  close: UseDisclosureReturn[1]['close'];
};

export const PopoverContext = createContext<PopoverContextObject | null>(null);
