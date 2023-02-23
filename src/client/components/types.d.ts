import { NodeType } from '@/client/shared/element';

export type NodeComponentProps = {
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onContextMenu: (e: KonvaEventObject<PointerEvent>, id: string) => void;
  onNodeChange: (node: NodeType) => void;
} & NodeType;
