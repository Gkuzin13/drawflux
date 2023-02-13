import { NodeType, NodeProps } from '@/shared/constants/element';

export type NodeComponentProps = {
  isSelected: boolean;
  onSelect: () => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
  onNodeChange: (node: NodeType | null) => void;
} & NodeType;
