import type { Entity } from '@/constants/index';

export type MenuPanelActionType = (typeof MENU_PANEL_ACTIONS)[number]['value'];

export const MENU_PANEL_ACTIONS: Entity<string>[] = [
  {
    value: 'open',
    name: 'Open',
    icon: 'fileUpload',
  },
  {
    value: 'save',
    name: 'Save',
    icon: 'fileDownload',
  },
  {
    value: 'export-as-image',
    name: 'Export Image',
    icon: 'photoDown',
  },
];
