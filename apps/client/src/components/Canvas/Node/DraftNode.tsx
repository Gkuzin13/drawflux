import type { NodeObject } from 'shared';
import Node from './Node';

type Props = {
  node: NodeObject;
  stageScale: number;
  onDraftEnd: (node: NodeObject) => void;
};

const DraftNode = ({ node, stageScale, onDraftEnd }: Props) => {
  return (
    <Node
      node={node}
      selected={false}
      stageScale={stageScale}
      onPress={() => null}
      onNodeChange={onDraftEnd}
    />
  );
};

export default DraftNode;
