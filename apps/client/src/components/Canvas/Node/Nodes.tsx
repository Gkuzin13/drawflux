import { memo } from 'react';
import Node, { type NodeComponentProps } from './Node';
import type { NodeObject } from 'shared';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
  editingNodeId: string | null;
} & Omit<NodeComponentProps, 'node' | 'selected' | 'editing'>;

const Nodes = ({
  nodes,
  selectedNodeId,
  editingNodeId,
  ...restProps
}: Props) => {
  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            editing={editingNodeId === node.nodeProps.id}
            {...restProps}
          />
        );
      })}
    </>
  );
};

export default memo(Nodes);
