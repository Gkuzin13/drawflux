import { Layer } from 'react-konva';
import DraftNode from './Node/DraftNode';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';
import Nodes from './Nodes';
import { NodeType } from '../shared/element';
import { Tool } from '../shared/tool';
import { useAppDispatch } from '../stores/hooks';
import { nodesActions } from '../stores/slices/nodesSlice';
import { controlActions } from '../stores/slices/controlSlice';
import { LayerConfig } from 'konva/lib/Layer';
import { PropsWithChildren } from 'react';

type Props = {
  nodes: NodeType[];
  selectedNodeId: string | null;
  toolType: Tool['value'];
  draftNode: NodeType | null;
  intersectedNodes: NodeType[];
  config?: LayerConfig;
  handleDraftEnd: (node: NodeType) => void;
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

  const handleNodeChange = (nodes: NodeType[]) => {
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
