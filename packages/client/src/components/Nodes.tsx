import type { NodeObject } from '@shared';
import { Tool } from '@/constants/tool';
import Node from './Node/Node';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
  toolType: Tool['value'];
  onNodePress: (nodeId: string) => void;
  onNodeChange: (node: NodeObject) => void;
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

export default Nodes;
