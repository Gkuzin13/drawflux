import { Node, NodeProps } from '@/shared/constants/base';

export type NodeComponentProps = {
  isSelected: boolean;
  onSelect: () => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
  onNodeChange: (node: Node) => void;
} & Node;
