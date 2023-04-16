import type { LayerConfig } from 'konva/lib/Layer';
import { type PropsWithChildren, useMemo } from 'react';
import { Layer } from 'react-konva';
import type { NodeObject } from 'shared';
import type { Tool } from '@/constants/tool';
import { useAppDispatch } from '../stores/hooks';
import { controlActions } from '../stores/slices/controlSlice';
import { nodesActions } from '../stores/slices/nodesSlice';
import DraftNode from './Node/DraftNode';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';
import Nodes from './Nodes';

type Props = PropsWithChildren<{
  nodes: NodeObject[];
  selectedNodeId: string | null;
  toolType: Tool['value'];
  draftNode: NodeObject | null;
  selectedNodesIds: string[];
  config?: LayerConfig;
  onDraftEnd: (node: NodeObject) => void;
}>;

const NodesLayer = ({
  nodes,
  selectedNodeId,
  toolType,
  draftNode,
  selectedNodesIds,
  config,
  onDraftEnd,
  children,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleNodeChange = (nodes: NodeObject[]) => {
    dispatch(nodesActions.update(nodes));
  };

  const handleNodePress = (nodeId: string) => {
    dispatch(controlActions.setSelectedNodeId(nodeId));
  };

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => selectedNodesIds.includes(node.nodeProps.id));
    // Temporary workaround
  }, [selectedNodesIds]);

  return (
    <Layer {...config}>
      <Nodes
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        toolType={toolType}
        onNodePress={handleNodePress}
        onNodeChange={(node) => handleNodeChange([node])}
      />
      {draftNode && <DraftNode node={draftNode} onDraftEnd={onDraftEnd} />}
      {selectedNodes.length ? (
        <NodeGroupTransformer
          selectedNodes={selectedNodes}
          onDragEnd={handleNodeChange}
        />
      ) : null}
      {children}
    </Layer>
  );
};

export default NodesLayer;
