import { useMemo } from 'react';
import type { NodeObject } from 'shared';
import type { SelectedNodesIds } from '@/constants/app';
import type { Tool } from '@/constants/tool';
import Node from './Node/Node';

type Props = {
  nodes: NodeObject[];
  selectedNodesIds: SelectedNodesIds;
  toolType: Tool['value'];
  onNodePress: (nodeId: string) => void;
  onNodeChange: (node: NodeObject) => void;
};

const Nodes = ({
  nodes,
  selectedNodesIds,
  toolType,
  onNodePress,
  onNodeChange,
}: Props) => {
  const selectedNodeId = useMemo(() => {
    if (Object.keys(selectedNodesIds).length !== 1) return null;

    return Object.keys(selectedNodesIds)[0];
  }, [selectedNodesIds]);

  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            draggable={toolType === 'select'}
            onPress={onNodePress}
            onNodeChange={onNodeChange}
          />
        );
      })}
    </>
  );
};

export default Nodes;
