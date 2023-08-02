import { memo } from 'react';
import Node, { type NodeComponentProps } from './Node/Node';
import type { NodeObject } from 'shared';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
} & Pick<NodeComponentProps, 'onNodeChange' | 'onPress' | 'stageScale'>;

const Nodes = ({
  nodes,
  selectedNodeId,
  stageScale,
  onNodeChange,
  onPress,
}: Props) => {
  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            stageScale={stageScale}
            onNodeChange={onNodeChange}
            onPress={onPress}
          />
        );
      })}
    </>
  );
};

export default memo(Nodes);
