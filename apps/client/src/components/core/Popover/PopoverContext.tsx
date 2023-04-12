import { createContext } from 'react';
import { type UseDisclosureReturn } from '@/hooks/useDisclosure/useDisclosure';

export type PopoverContextObject = {
  opened: boolean;
  toggle: UseDisclosureReturn[1]['toggle'];
  close: UseDisclosureReturn[1]['close'];
};

export const PopoverContext = createContext<PopoverContextObject | null>(null);
