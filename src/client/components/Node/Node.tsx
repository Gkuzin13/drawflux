import { getElement, NodeType } from '@/client/shared/constants/element';

export type NodeComponentProps = {
  node: NodeType;
  selected: boolean;
  draggable: boolean;
  onPress: (nodeId: string) => void;
  onNodeChange: (node: NodeType) => void;
};

const Node = ({ node, ...restProps }: NodeComponentProps) => {
  const Element = getElement(node.type);

  return <Element node={node} {...restProps} />;
};

export default Node;
