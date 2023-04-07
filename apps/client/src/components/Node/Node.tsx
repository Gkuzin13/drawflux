import { getElement } from '@/constants/element';
import type { NodeObject } from '@shared';

export type NodeComponentProps = {
  node: NodeObject;
  selected: boolean;
  draggable: boolean;
  onPress: (nodeId: string) => void;
  onNodeChange: (node: NodeObject) => void;
};

const Node = ({ node, ...restProps }: NodeComponentProps) => {
  const Element = getElement(node.type);

  return <Element node={node} {...restProps} />;
};

export default Node;
