import { memo, useCallback, useMemo } from 'react';
import type { NodeObject } from 'shared';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { canvasActions, selectCanvas } from '@/stores/slices/canvas';
import Node from './Node/Node';
import NodeGroupTransformer from './Transformer/NodeGroupTransformer';

type Props = {
  selectedNodesIds: string[];
  onNodesChange: (nodes: NodeObject[]) => void;
};

const Nodes = ({ selectedNodesIds, onNodesChange }: Props) => {
  const { toolType, nodes } = useAppSelector(selectCanvas);

  const dispatch = useAppDispatch();

  const areNodesDraggable = useMemo(() => toolType === 'select', [toolType]);

  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const selectedNodeId = useMemo(() => {
    if (selectedNodes.length === 1) return selectedNodes[0].nodeProps.id;

    return null;
  }, [selectedNodes]);

  const handleNodePress = useCallback(
    (nodeId: string) => {
      if (toolType === 'select') {
        dispatch(canvasActions.setSelectedNodesIds([nodeId]));
      }
    },
    [toolType, dispatch],
  );

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
            draggable={areNodesDraggable}
            onPress={handleNodePress}
            onNodeChange={handleNodeChange}
          />
        );
      })}
      {selectedNodesIds.length > 1 ? (
        <NodeGroupTransformer
          nodes={selectedNodes}
          draggable={true}
          onDragEnd={onNodesChange}
        />
      ) : null}
    </>
  );
};

export default memo(Nodes);
