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

const getElement = (element: NodeType) => {
  switch (element) {
    case 'arrow':
      return ArrowDrawable;
    case 'rectangle':
      return RectDrawable;
    case 'ellipse':
      return EllipseDrawable;
    case 'draw':
      return FreePathDrawable;
    case 'text':
      return EditableText;
  }
};

const Node = ({ node, ...restProps }: NodeComponentProps) => {
  const Element = getElement(node.type);

  return <Element node={node} {...restProps} />;
};

export default Node;
