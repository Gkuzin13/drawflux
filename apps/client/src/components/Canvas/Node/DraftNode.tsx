import type { NodeObject } from 'shared';
import Node from './Node';

type Props = {
  node: NodeObject;
  onDraftEnd: (node: NodeObject) => void;
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
