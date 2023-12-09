import Node from './Node';
import { type NodeComponentProps } from './Node';

type Props = Omit<NodeComponentProps, 'selected'>;

const NodeDraft = ({ node, stageScale, onNodeChange, onNodeDelete }: Props) => {
  return (
    <Node
      node={node}
      selected={false}
      stageScale={stageScale}
      onNodeChange={onNodeChange}
      onNodeDelete={onNodeDelete}
    />
  );
};

export default NodeDraft;
