import { memo } from 'react';
import { NodeType } from '../shared/constants/element';
import { Tool } from '../shared/constants/tool';
import Node from './Node/Node';

type Props = {
  nodes: NodeType[];
  selectedNodeId: string | null;
  toolType: Tool['value'];
  onNodePress: (nodeId: string) => void;
  onNodeChange: (node: NodeType) => void;
};

const Nodes = ({
  nodes,
  selectedNodeId,
  toolType,
  onNodePress,
  onNodeChange,
}: Props) => {
  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            draggable={toolType !== 'hand'}
            onPress={onNodePress}
            onNodeChange={onNodeChange}
          />
        );
      })}
    </>
  );
};

export default memo(Nodes);