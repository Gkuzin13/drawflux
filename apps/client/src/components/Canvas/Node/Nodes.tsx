import { memo } from 'react';
import Node, { type NodeComponentProps } from './Node';
import type { NodeObject } from 'shared';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
} & Pick<NodeComponentProps, 'onNodeChange' | 'stageScale'>;

const Nodes = ({ nodes, selectedNodeId, stageScale, onNodeChange }: Props) => {
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
          />
        );
      })}
    </>
  );
};

export default memo(Nodes);
