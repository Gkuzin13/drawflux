import { memo, useCallback, useMemo } from 'react';
import Nodes from '../Node/Nodes';
import NodeGroupTransformer from '../Transformer/NodeGroupTransformer';
import useFontFaceObserver from '@/hooks/useFontFaceObserver';
import { TEXT } from '@/constants/shape';
import { useAppSelector } from '@/stores/hooks';
import { selectNodes, useSelectNodesById } from '@/services/canvas/slice';
import type { NodeObject } from 'shared';
import type { NodeComponentProps } from '../Node/Node';

type Props = {
  selectedNodeIds: string[];
  editingNodeId: string | null;
  stageScale: number;
  onNodesChange: (nodes: NodeObject[]) => void;
} & Omit<NodeComponentProps, 'node' | 'selected' | 'editing' | 'onNodeChange'>;

const NodesLayer = ({
  selectedNodeIds,
  editingNodeId,
  stageScale,
  onNodesChange,
  onTextChange,
}: Props) => {
  const nodes = useAppSelector(selectNodes);
  const selectedNodes = useSelectNodesById(selectedNodeIds);

  /*
   * Triggers re-render when font is loaded
   * to make sure font is loaded before rendering nodes
   */
  const { loading } = useFontFaceObserver(TEXT.FONT_FAMILY);

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

  if (loading) {
    return null;
  }

  return (
    <>
      <Nodes
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        editingNodeId={editingNodeId}
        stageScale={stageScale}
        onNodeChange={handleNodeChange}
        onTextChange={onTextChange}
      />
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

export default memo(NodesLayer);
