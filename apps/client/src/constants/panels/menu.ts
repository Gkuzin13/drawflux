import { TbFileDownload, TbFileUpload, TbPhotoDown } from 'react-icons/tb';

export type MenuPanelActionType = (typeof MENU_PANEL_ACTIONS)[number]['key'];

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
