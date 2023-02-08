import { Node, NodeProps } from '@/shared/constants/base';

export interface NodeComponentProps extends Node {
  isSelected: boolean;
  onSelect: () => void;
  onNodeChange: (args: onNodeChangeArgs) => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
}

export type onNodeChangeArgs = Pick<
  NodeComponentProps,
  'nodeProps' | 'text' | 'type'
>;
