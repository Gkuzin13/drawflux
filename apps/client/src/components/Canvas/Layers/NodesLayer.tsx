import Nodes from '../Nodes';
import type { NodeObject } from 'shared';
import { useCallback, useMemo } from 'react';
import NodeGroupTransformer from '../Transformer/NodeGroupTransformer';
import useFontFaceObserver from '@/hooks/useFontFaceObserver';
import { TEXT } from '@/constants/shape';
import { useAppSelector } from '@/stores/hooks';
import { selectNodes } from '@/stores/slices/canvas';
import NodeDraft from '../Node/NodeDraft';

type Props = {
  selectedNodesIds: string[];
  stageScale: number;
  nodeDrafts: NodeObject[];
  onNodesChange: (nodes: NodeObject[]) => void;
  onNodeDraftFinish: (node: NodeObject) => void;
  onNodesDelete: (node: NodeObject) => void;
};

const NodesLayer = ({
  selectedNodesIds,
  stageScale,
  nodeDrafts,
  onNodesChange,
  onNodeDraftFinish,
  onNodesDelete,
}: Props) => {
  const nodes = useAppSelector(selectNodes);

  /*
   * Triggers re-render when font is loaded
   * to make sure font is loaded before rendering nodes
   */
  const { loading } = useFontFaceObserver(TEXT.FONT_FAMILY);

  const selectedNodes = useMemo(() => {
    if (!selectedNodesIds.length) {
      return [];
    }

    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const selectedNodeId = useMemo(() => {
    const selectedSingleNode = selectedNodes.length === 1;

    return selectedSingleNode ? selectedNodes[0].nodeProps.id : null;
  }, [selectedNodes]);

  const selectedMultipleNodes = selectedNodes.length > 1;

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
        stageScale={stageScale}
        onNodeChange={handleNodeChange}
      />
      {nodeDrafts.map((node) => {
        return (
          <NodeDraft
            key={node.nodeProps.id}
            node={node}
            stageScale={stageScale}
            onNodeChange={onNodeDraftFinish}
            onNodeDelete={onNodesDelete}
          />
        );
      })}
      {selectedMultipleNodes ? (
        <NodeGroupTransformer
          nodes={selectedNodes}
          stageScale={stageScale}
          onDragEnd={onNodesChange}
        />
      ) : null}
    </>
  );
};

export default NodesLayer;
