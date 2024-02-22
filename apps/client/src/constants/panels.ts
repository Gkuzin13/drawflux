import { KEYS } from './keys';
import { Schemas } from 'shared';
import type { HistoryActionKey } from '@/stores/reducers/history';
import type { Entity } from '@/constants/index';
import type { ShapesThumbnailStyle } from '@/components/Elements/ShapesThumbnail/ShapesThumbnail';
import type {
  ArrowHead,
  ArrowHeadDirection,
  NodeColor,
  NodeFill,
  NodeLine,
  NodeSize,
} from 'shared';
import type { ToolType } from './app';

export type HistoryControlKey = Exclude<HistoryActionKey, 'reset'>;

export const HISTORY = {
  undo: {
    name: 'Undo',
    value: 'undo',
    icon: 'arrowBackUp',
    key: 'Z',
    modifierKeys: ['Ctrl'],
  },
  redo: {
    name: 'Redo',
    value: 'redo',
    icon: 'arrowForwardUp',
    key: 'Z',
    modifierKeys: ['Ctrl', 'Shift'],
  },
} as const;

export const DELETE_NODES = {
  name: 'Delete',
  value: 'deleteNodes',
  icon: 'trash',
  key: 'Del',
  modifierKeys: [],
} as const;

export const LIBRARY = {
  dataTransferFormat: 'json/library-item',
} as const;

export const LIBRARY_ITEM: { style: Partial<ShapesThumbnailStyle> } = {
  style: {
    width: 54,
    height: 54,
    padding: 2,
    shapesScale: 1.5,
  },
} as const;

export type MenuPanelActionType = (typeof MENU_PANEL_ACTIONS)[number]['value'];

export const MENU_PANEL_ACTIONS: readonly Entity<
  'open' | 'save' | 'export-as-image'
>[] = [
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
] as const;

export const LINE: Entity<NodeLine>[] = [
  {
    value: 'solid',
    name: 'Solid',
    icon: 'minus',
  },
  {
    value: 'dashed',
    name: 'Dashed',
    icon: 'lineDashed',
  },
  {
    value: 'dotted',
    name: 'Dotted',
    icon: 'lineDotted',
  },
];

export const FILL: Entity<NodeFill>[] = [
  {
    value: 'none',
    name: 'None',
    icon: 'filledNone',
  },
  {
    value: 'semi',
    name: 'Semi',
    icon: 'filledSemi',
  },
  {
    value: 'solid',
    name: 'Solid',
    icon: 'filledSolid',
  },
];

export const ARROW_HEADS: Record<
  ArrowHeadDirection,
  Entity<NonNullable<ArrowHead>>[]
> = {
  start: [
    {
      value: 'arrow',
      name: 'Arrow',
      icon: 'arrowNarrowLeft',
    },
    {
      value: 'none',
      name: 'None',
      icon: 'minus',
    },
  ],
  end: [
    {
      value: 'none',
      name: 'None',
      icon: 'minus',
    },
    {
      value: 'arrow',
      name: 'Arrow',
      icon: 'arrowNarrowRight',
    },
  ],
};

export const OPACITY = {
  minValue: Schemas.Node.shape.style.shape.opacity.minValue || 0.2,
  maxValue: Schemas.Node.shape.style.shape.opacity.maxValue || 1,
  step: 0.1,
} as const;

export const ANIMATED = {
  name: 'Animated',
  value: 'animated',
} as const;

export const SIZE: readonly Entity<NodeSize>[] = [
  {
    value: 'small',
    name: 'Small',
    icon: 'letterS',
  },
  {
    value: 'medium',
    name: 'Medium',
    icon: 'letterM',
  },
  {
    value: 'large',
    name: 'Large',
    icon: 'letterL',
  },
  {
    value: 'extra-large',
    name: 'Extra Large',
    icon: 'extraLarge',
  },
] as const;

export type Tool = Entity<ToolType> & {
  key: (typeof KEYS)[keyof typeof KEYS];
};

export const TOOLS: readonly Tool[] = [
  {
    name: 'Select',
    value: 'select',
    icon: 'pointer',
    key: KEYS.V,
  },
  {
    name: 'Hand',
    icon: 'handStop',
    value: 'hand',
    key: KEYS.H,
  },
  {
    name: 'Arrow',
    value: 'arrow',
    icon: 'arrowUpRight',
    key: KEYS.A,
  },
  {
    name: 'Ellipse',
    value: 'ellipse',
    icon: 'circle',
    key: KEYS.O,
  },
  {
    name: 'Rectangle',
    value: 'rectangle',
    icon: 'square',
    key: KEYS.R,
  },
  {
    name: 'Draw',
    value: 'draw',
    icon: 'scribble',
    key: KEYS.P,
  },
  {
    name: 'Text',
    value: 'text',
    icon: 'text',
    key: KEYS.T,
  },
  {
    name: 'Laser',
    value: 'laser',
    icon: 'laser',
    key: KEYS.L,
  },
] as const;

export type ZoomActionKey = 'in' | 'out' | 'reset';

export const ZOOM = {
  in: {
    name: 'Zoom In',
    value: 'in',
    icon: 'plus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel++'],
  },
  out: {
    name: 'Zoom Out',
    value: 'out',
    icon: 'minus',
    key: 'Ctrl',
    modifierKeys: ['Mouse Wheel--'],
  },
  reset: {
    name: 'Reset Zoom',
    value: 'reset',
  },
} as const;

export const GRID_COLORS: { name: string; value: NodeColor }[] = [
  { name: 'Red', value: 'red600' },
  { name: 'Pink', value: 'pink600' },
  { name: 'Deep Orange', value: 'deep-orange600' },
  { name: 'Yellow', value: 'yellow600' },
  { name: 'Green', value: 'green600' },
  { name: 'Teal', value: 'teal600' },
  { name: 'Light Blue', value: 'light-blue600' },
  { name: 'Blue', value: 'blue600' },
  { name: 'Deep Purple', value: 'deep-purple600' },
  { name: 'Indigo', value: 'indigo600' },
  { name: 'Black', value: 'black' },
  { name: 'Gray', value: 'gray600' },
];
