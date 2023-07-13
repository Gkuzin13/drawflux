import { memo, useCallback, useMemo } from 'react';
import type { NodeObject } from 'shared';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import Node from './Node/Node';
import NodeGroupTransformer from './Transformer/NodeGroupTransformer';
import useFontFaceObserver from '@/hooks/useFontFaceObserver';
import { TEXT } from '@/constants/shape';

type Props = {
  selectedNodesIds: string[];
  onNodesChange: (nodes: NodeObject[]) => void;
  onNodePress: (nodeId: string) => void;
};

const Nodes = ({ selectedNodesIds, onNodesChange, onNodePress }: Props) => {
  const { toolType, nodes } = useAppSelector(selectCanvas);

  // Triggers re-render when font is loaded
  const { loading } = useFontFaceObserver(TEXT.FONT_FAMILY);

  const areNodesDraggable = useMemo(() => toolType === 'select', [toolType]);

  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const selectedNodeId = useMemo(() => {
    if (selectedNodes.length === 1) return selectedNodes[0].nodeProps.id;

    return null;
  }, [selectedNodes]);

  const handleNodeChange = useCallback(
    (node: NodeObject) => {
      onNodesChange([node]);
    },
    [onNodesChange],
  );

  if (loading) {
    return null;
  }

  return (
    <>
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            draggable={areNodesDraggable}
            onNodeChange={handleNodeChange}
            onPress={onNodePress}
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
