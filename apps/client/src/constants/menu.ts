import { IoTrashOutline } from 'react-icons/io5';
import { TbFileDownload, TbFileUpload, TbPhotoDown } from 'react-icons/tb';

export type ContextMenuItem =
  | (typeof STAGE_CONTEXT_MENU_ACTIONS)[number]
  | (typeof NODE_CONTEXT_MENU_ACTIONS)[number];

export type MenuPanelActionType = (typeof MENU_PANEL_ACTIONS)[number]['key'];

export const NODE_CONTEXT_MENU_ACTIONS = [
  {
    key: 'delete-node',
    name: 'Delete',
    icon: IoTrashOutline,
  },
] as const;

export const STAGE_CONTEXT_MENU_ACTIONS = [
  {
    key: 'select-all',
    name: 'Select All',
  },
  {
    key: 'select-none',
    name: 'Select None',
  },
] as const;

export const MENU_PANEL_ACTIONS = [
  {
    key: 'import-json',
    name: 'Open',
    icon: TbFileUpload,
  },
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
] as const;
