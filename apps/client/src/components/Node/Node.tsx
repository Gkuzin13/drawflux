import { memo } from 'react';
import type { NodeObject, NodeType } from 'shared';
import ArrowDrawable from '@/components/shapes/ArrowDrawable/ArrowDrawable';
import EllipseDrawable from '@/components/shapes/EllipseDrawable/EllipseDrawable';
import FreePathDrawable from '@/components/shapes/FreePathDrawable/FreePathDrawable';
import RectDrawable from '@/components/shapes/RectDrawable/RectDrawable';
import EditableText from '../shapes/EditableText/EditableText';

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

export default memo(Node);
