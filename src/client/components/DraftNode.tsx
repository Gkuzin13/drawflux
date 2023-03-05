import { NodeType } from '../shared/element';
import Node from './Node';

type Props = {
  node: NodeType;
  onDraftEnd: (node: NodeType) => void;
};

const DraftNode = ({ node, onDraftEnd }: Props) => {
  return (
    <Node
      node={node}
      selected={false}
      draggable={false}
      onPress={() => null}
      onNodeChange={onDraftEnd}
    />
  );
};

export default DraftNode;
