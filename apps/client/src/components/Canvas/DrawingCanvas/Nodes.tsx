import { memo, useCallback, useMemo } from 'react';
import NodeGroupTransformer from '../Transformer/NodeGroupTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectNodes, useSelectNodesById } from '@/services/canvas/slice';
import Node from '../Node/Node';
import type { NodeObject } from 'shared';
import type { NodeComponentProps } from '../Node/Node';

type Props = {
  selectedNodeIds: string[];
  editingNodeId: string | null;
  stageScale: number;
  onNodesChange: (nodes: NodeObject[]) => void;
} & Omit<NodeComponentProps, 'node' | 'selected' | 'editing' | 'onNodeChange'>;

const Nodes = ({
  selectedNodeIds,
  editingNodeId,
  stageScale,
  onNodesChange,
  onTextChange,
}: Props) => {
  const nodes = useAppSelector(selectNodes);
  const selectedNodes = useSelectNodesById(selectedNodeIds);

  const selectedNodeId = useMemo(() => {
    const selectedSingleNode = selectedNodes.length === 1;

    return selectedSingleNode ? selectedNodes[0].nodeProps.id : null;
  }, [selectedNodes]);

  const selectedMultipleNodes = useMemo(() => {
    return selectedNodes.length > 1;
  }, [selectedNodes.length]);

  const handleNodeChange = useCallback(
    (node: NodeObject) => {
      onNodesChange([node]);
    },
    [onNodesChange],
  );
  
  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            editing={editingNodeId === node.nodeProps.id}
            stageScale={stageScale}
            onNodeChange={handleNodeChange}
            onTextChange={onTextChange}
          />
        );
      })}
      {selectedMultipleNodes && (
        <NodeGroupTransformer
          nodes={selectedNodes}
          stageScale={stageScale}
          onNodesChange={onNodesChange}
        />
      )}
    </>
  );
};

export default memo(Nodes);
