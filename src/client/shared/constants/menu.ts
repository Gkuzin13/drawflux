import { IconType } from 'react-icons';
import { IoTrashOutline } from 'react-icons/io5';
import { TbFileDownload, TbFileUpload, TbPhotoDown } from 'react-icons/tb';

export type ContextMenuItem = {
  key: string;
  name: string;
  icon?: IconType;
};

export const NODE_CONTEXT_MENU_ACTIONS = [
  {
    key: 'delete-node',
    name: 'Delete',
    icon: IoTrashOutline,
  },
] as ContextMenuItem[];

export const STAGE_CONTEXT_MENU_ACTIONS = [
  {
    key: 'select-all',
    name: 'Select All',
  },
] as ContextMenuItem[];

export const MENU_PANEL_ACTIONS = [
  {
    key: 'export-as-image',
    name: 'Export As Image',
    icon: TbPhotoDown,
  },
  {
    key: 'export-as-json',
    name: 'Export As JSON',
    icon: TbFileDownload,
  },
  {
    key: 'import-json',
    name: 'Import JSON',
    icon: TbFileUpload,
  },
] as const;
