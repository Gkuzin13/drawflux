import { TbFileDownload, TbFileUpload, TbPhotoDown } from 'react-icons/tb';

export type MenuPanelActionType = (typeof MENU_PANEL_ACTIONS)[number]['key'];

export const MENU_PANEL_ACTIONS = [
  {
    key: 'open',
    name: 'Open',
    icon: TbFileUpload,
  },
  {
    key: 'save',
    name: 'Save',
    icon: TbFileDownload,
  },
  {
    key: 'export-as-image',
    name: 'Export Image',
    icon: TbPhotoDown,
  },
] as const;
