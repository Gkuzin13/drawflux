import type { LayerConfig } from 'konva/lib/Layer';
import type { PropsWithChildren } from 'react';
import { Layer } from 'react-konva';
import type { NodeObject } from 'shared';
import type { Tool } from '@/constants/tool';
import { useAppDispatch } from '../stores/hooks';
import { controlActions } from '../stores/slices/controlSlice';
import { nodesActions } from '../stores/slices/nodesSlice';
import DraftNode from './Node/DraftNode';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';
import Nodes from './Nodes';

type Props = {
  nodes: NodeObject[];
  selectedNodeId: string | null;
  toolType: Tool['value'];
  draftNode: NodeObject | null;
  intersectedNodes: NodeObject[];
  config?: LayerConfig;
  handleDraftEnd: (node: NodeObject) => void;
} & PropsWithChildren;

const NodesLayer = ({
  nodes,
  selectedNodeId,
  toolType,
  draftNode,
  intersectedNodes,
  config,
  handleDraftEnd,
  children,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleNodeChange = (nodes: NodeObject[]) => {
    dispatch(nodesActions.update(nodes));
  };

  const handleNodePress = (nodeId: string) => {
    dispatch(controlActions.setSelectedNode(nodeId));
  };

  return (
    <Layer {...config}>
      <Nodes
        nodes={nodes}
        selectedNodeId={selectedNodeId}
        toolType={toolType}
        onNodePress={handleNodePress}
        onNodeChange={(node) => handleNodeChange([node])}
      />
      {draftNode && <DraftNode node={draftNode} onDraftEnd={handleDraftEnd} />}
      {intersectedNodes.length ? (
        <NodeGroupTransformer
          selectedNodes={intersectedNodes}
          onDragStart={handleNodeChange}
          onDragEnd={handleNodeChange}
        />
      ) : null}
      {children}
    </Layer>
  );
};

export default NodesLayer;
