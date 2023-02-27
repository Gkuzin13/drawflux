import { NodeType } from '@/client/shared/element';

export type NodeComponentProps = {
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onNodeChange: (node: NodeType | null) => void;
} & NodeType;
