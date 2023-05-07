import type { LayerConfig } from 'konva/lib/Layer';
import { type PropsWithChildren, useMemo } from 'react';
import { Layer } from 'react-konva';
import type { NodeObject } from 'shared';
import type { Tool } from '@/constants/tool';
import DraftNode from './Node/DraftNode';
import Node from './Node/Node';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';

type Props = PropsWithChildren<{
  nodes: NodeObject[];
  toolType: Tool['value'];
  draftNode: NodeObject | null;
  config?: LayerConfig;
  selectedNodesIds: string[];
  onNodePress: (nodeId: string) => void;
  onNodesChange: (nodes: NodeObject[]) => void;
  onDraftEnd: (node: NodeObject) => void;
}>;

const NodesLayer = ({
  nodes,
  toolType,
  draftNode,
  config,
  selectedNodesIds,
  onNodePress,
  onNodesChange,
  onDraftEnd,
  children,
}: Props) => {
  const selectedNodes = useMemo(() => {
    const nodesIds = new Set(selectedNodesIds);

    return nodes.filter((node) => nodesIds.has(node.nodeProps.id));
  }, [selectedNodesIds, nodes]);

  const selectedNodeId = useMemo(() => {
    if (selectedNodesIds.length !== 1) return null;

    return selectedNodesIds[0];
  }, [selectedNodesIds]);

  return (
    <Layer listening={config?.listening}>
      {children}
      {nodes.map((node) => {
        return (
          <Node
            key={node.nodeProps.id}
            node={node}
            selected={selectedNodeId === node.nodeProps.id}
            draggable={toolType === 'select'}
            onPress={onNodePress}
            onNodeChange={(updatedNode) => onNodesChange([updatedNode])}
          />
        );
      })}
      {draftNode && <DraftNode node={draftNode} onDraftEnd={onDraftEnd} />}
      {selectedNodes.length > 1 ? (
        <NodeGroupTransformer
          nodes={selectedNodes}
          draggable={toolType !== 'hand'}
          onDragEnd={onNodesChange}
        />
      ) : null}
    </Layer>
  );
};

export default NodesLayer;
