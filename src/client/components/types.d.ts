import { NodeType } from '@/client/shared/element';

export type NodeComponentProps = {
  node: NodeType;
  selected: boolean;
  draggable: boolean;
  onPress: (nodeId: string) => void;
  onNodeChange: (node: NodeType) => void;
};
