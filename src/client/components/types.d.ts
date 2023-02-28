import { NodeType } from '@/client/shared/element';

export type NodeComponentProps = {
  node: NodeType;
  selected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onNodeChange: (node: NodeType | null) => void;
};
