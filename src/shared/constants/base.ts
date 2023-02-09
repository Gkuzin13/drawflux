import ArrowDrawable from '@/components/ArrowDrawable';
import CircleDrawable from '@/components/CircleDrawable';
import RectDrawable from '@/components/RectDrawable';
import FreePathDrawable from '@/components/FreePathDrawable';
import EditableText from '@/components/EditableText';
import type { SimpleColors } from '@nextui-org/react';
import { ACTION_TYPES } from '@/stores/nodesSlice';
import { NodeComponentProps } from '@/components/types';

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
    draftMode: 'drawing',
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.CIRCLE]: {
    component: CircleDrawable,
    draftMode: 'drawing',
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.RECTANGLE]: {
    component: RectDrawable,
    draftMode: 'drawing',
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.FREE_PATH]: {
    component: FreePathDrawable,
    draftMode: 'drawing',
    menuItems: [...BASE_MENU_ITEMS],
  },
  [NODE_TYPES.EDITABLE_TEXT]: {
    component: EditableText,
    draftMode: 'text',
    menuItems: [...BASE_MENU_ITEMS],
  },
};

export type NodeMap = {
  [K in NodeType]: NodeMapItem;
};

export type DraftMode = 'drawing' | 'text';

export type NodeMapItem = {
  component: (props: NodeComponentProps) => JSX.Element;
  draftMode: DraftMode;
  menuItems: MenuItem[];
};

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

export type Node = {
  type: NodeType;
  nodeProps: NodeProps;
  text: string | null;
};

export type DrawableNode = Node;

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

export const CURSOR_STYLES = Object.freeze({
  POINTER: 'pointer',
  DEFAULT: 'default',
  ALL_SCROLL: 'all-scroll',
  GRAB: 'GRAB',
  EW_RESIZE: 'ew-resize',
  NS_RESIZE: 'ns-resize',
  NESW_RESIZE: 'nesw-resize',
  NWSE_RESIZE: 'nwse-resize',
});
