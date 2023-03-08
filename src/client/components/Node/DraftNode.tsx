import { NodeType } from '../../shared/constants/element';
import Node from '../Node/Node';

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
