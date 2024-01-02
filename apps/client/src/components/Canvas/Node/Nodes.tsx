import { memo } from 'react';
import Node, { type NodeComponentProps } from './Node';
import type { NodeObject } from 'shared';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
} & Pick<NodeComponentProps, 'onNodeChange'| 'onTextChange' | 'stageScale'>;

const Nodes = ({ nodes, selectedNodeId, stageScale, onNodeChange, onTextChange }: Props) => {
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
            onTextChange={onTextChange}
          />
        );
      })}
    </>
  );
};

export default memo(Nodes);
