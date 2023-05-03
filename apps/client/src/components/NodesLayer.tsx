import type { LayerConfig } from 'konva/lib/Layer';
import { type PropsWithChildren, useMemo } from 'react';
import { Layer } from 'react-konva';
import type { NodeObject } from 'shared';
import type { Tool } from '@/constants/tool';
import { canvasActions, selectCanvas } from '@/stores/slices/canvasSlice';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { nodesActions } from '../stores/slices/nodesSlice';
import DraftNode from './Node/DraftNode';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';
import Nodes from './Nodes';

type Props = PropsWithChildren<{
  nodes: NodeObject[];
  toolType: Tool['value'];
  draftNode: NodeObject | null;
  config?: LayerConfig;
  onDraftEnd: (node: NodeObject) => void;
}>;

const NodesLayer = ({
  nodes,
  toolType,
  draftNode,
  config,
  onDraftEnd,
  children,
}: Props) => {
  const { selectedNodesIds } = useAppSelector(selectCanvas);
  const dispatch = useAppDispatch();

  const handleNodeChange = (nodes: NodeObject[]) => {
    dispatch(nodesActions.update(nodes));
  };

  const handleNodePress = (nodeId: string) => {
    if (toolType === 'select') {
      dispatch(canvasActions.setSelectedNodesIds({ [nodeId]: true }));
    }
  };

  const selectedNodeId = useMemo(() => {
    if (Object.keys(selectedNodesIds).length !== 1) return null;

    return Object.keys(selectedNodesIds)[0];
  }, [selectedNodesIds]);

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => selectedNodesIds[node.nodeProps.id]);
  }, [selectedNodesIds, nodes]);

  return (
    <Layer listening={config?.listening}>
      {children}
      <Nodes
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        toolType={toolType}
        onNodePress={handleNodePress}
        onNodeChange={(node) => handleNodeChange([node])}
      />
      {draftNode && <DraftNode node={draftNode} onDraftEnd={onDraftEnd} />}
      {selectedNodes.length > 1 ? (
        <NodeGroupTransformer
          nodes={selectedNodes}
          draggable={toolType !== 'hand'}
          onDragEnd={handleNodeChange}
        />
      ) : null}
    </Layer>
  );
};

export default NodesLayer;
