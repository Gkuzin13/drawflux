import ArrowDrawable from '@/components/ArrowDrawable';
import CircleDrawable from '@/components/CircleDrawable';
import RectDrawable from '@/components/RectDrawable';
import FreePathDrawable from '@/components/FreePathDrawable';
import EditableText from '@/components/EditableText';
import type { SimpleColors } from '@nextui-org/react';
import { ACTION_TYPES } from '@/stores/nodesSlice';

export const NODE_TYPES = Object.freeze({
  ARROW: 'Arrow',
  CIRCLE: 'Circle',
  RECTANGLE: 'Rectangle',
  FREE_PATH: 'Free Path',
  EDITABLE_TEXT: 'Editable Text',
});

export const BASE_MENU_ITEMS: MenuItem[] = [
  { key: ACTION_TYPES.DELETE, color: 'error', name: 'Delete' },
];

export const NODES_MAP: NodeMap = {
  [NODE_TYPES.ARROW]: {
    component: ArrowDrawable,
    isDrawable: true,
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.CIRCLE]: {
    component: CircleDrawable,
    isDrawable: true,
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.RECTANGLE]: {
    component: RectDrawable,
    isDrawable: true,
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.FREE_PATH]: {
    component: FreePathDrawable,
    isDrawable: true,
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.EDITABLE_TEXT]: {
    component: EditableText,
    isDrawable: false,
    menuItems: [...BASE_MENU_ITEMS],
  },
};

export type NodeMap = {
  [K in NodeType]: NodeMapItem;
};

export type NodeMapItem = {
  component: (args: any) => JSX.Element;
  isDrawable: boolean;
  menuItems: MenuItem[];
};

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

export type Node = {
  type: NodeType;
  nodeProps: NodeProps;
  text?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type NodeProps = {
  id: string;
  points: Point[];
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type MenuItem = {
  key: string;
  name: string;
  color: SimpleColors;
};
