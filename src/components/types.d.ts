import { NodeType } from '@/shared/element';

export type NodeComponentProps = {
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
  onNodeChange: (node: NodeType | null) => void;
} & NodeType;
