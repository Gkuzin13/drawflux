import type { NodeObject, NodeType } from 'shared';
import ArrowDrawable from '@/components/Canvas/Shapes/ArrowDrawable/ArrowDrawable';
import EllipseDrawable from '@/components/Canvas/Shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/components/Canvas/Shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/components/Canvas/Shapes/RectDrawable/RectDrawable';
import EditableText from '../Shapes/EditableText/EditableText';

export type NodeComponentProps = {
  node: NodeObject;
  selected: boolean;
  draggable: boolean;
  onPress: (nodeId: string) => void;
  onNodeChange: (node: NodeObject) => void;
};

const elements: Record<NodeType, React.FC<NodeComponentProps>> = {
  arrow: ArrowDrawable,
  rectangle: RectDrawable,
  ellipse: EllipseDrawable,
  draw: FreePathDrawable,
  text: EditableText,
};

const Node = ({ node, ...restProps }: NodeComponentProps) => {
  const Element = elements[node.type];

  return <Element node={node} {...restProps} />;
};

export default Node;
