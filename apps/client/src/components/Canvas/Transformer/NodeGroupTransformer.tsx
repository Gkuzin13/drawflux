import { memo, useCallback, useState } from 'react';
import { Group } from 'react-konva';
import Nodes from '../Node/Nodes';
import useTransformer from '@/hooks/useTransformer';
import NodeTransformer from './NodeTransformer';
import { getPointsAbsolutePosition } from '@/utils/position';
import { mapNodesIds } from '@/utils/node';
import { noop } from '@/utils/is';
import type { KonvaNodeEvents } from 'react-konva';
import type Konva from 'konva';
import type { NodeObject } from 'shared';

type Props = {
  nodes: NodeObject[];
  stageScale: number;
  onNodesChange: (nodes: NodeObject[]) => void;
};

const transformerConfig: Konva.TransformerConfig = {
  enabledAnchors: [],
  rotateEnabled: false,
  resizeEnabled: false,
};

const transformerEvents: KonvaNodeEvents = {
  onDragStart: noop,
  onDragEnd: noop,
};

function setSelectedNodesVisibility(
  layer: Konva.Layer,
  selectedNodes: NodeObject[],
  visible: boolean,
) {
  const nodesIds = new Set(mapNodesIds(selectedNodes));

  const selectedLayerNodes = layer.getChildren((child) =>
    nodesIds.has(child.id()),
  );

  selectedLayerNodes.forEach((child) => child.visible(visible));
}

const NodeGroupTransformer = ({ nodes, stageScale, onNodesChange }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const { transformerRef, nodeRef } = useTransformer<Konva.Group>([nodes]);

  const handleDragStart = useCallback(() => {
    const layer = nodeRef.current?.getLayer();

    if (!layer) return;

    setIsDragging(true);

    setSelectedNodesVisibility(layer, nodes, false);
  }, [nodeRef, nodes]);

  const handleDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const group = event.target as Konva.Group;
      const stage = group?.getStage();
      const layer = group?.getLayer();

      if (!group || !layer || !stage) return;

      const groupChildren = group.getChildren();

      const nodesMap = new Map(nodes.map((node) => [node.nodeProps.id, node]));

      const updatedNodes = groupChildren
        .map((child) => {
          const node = nodesMap.get(child.id());

          if (!node) return;

          if (node.nodeProps.points) {
            const points = [node.nodeProps.point, ...node.nodeProps.points];

            const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
              points,
              child,
              stage,
            );

            return {
              ...node,
              nodeProps: {
                ...node.nodeProps,
                point: firstPoint,
                points: restPoints,
              },
            };
          }

          const { x, y } = child.getAbsolutePosition(stage);

          return {
            ...node,
            nodeProps: { ...node.nodeProps, point: [x, y] },
          };
        })
        .filter(Boolean) as NodeObject[];

      onNodesChange(updatedNodes);

      setSelectedNodesVisibility(layer, nodes, true);

      setIsDragging(false);

      group.position({ x: 0, y: 0 });
    },
    [nodes, onNodesChange],
  );

  return (
    <>
      <Group
        ref={nodeRef}
        visible={isDragging}
        draggable={true}
        listening={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Nodes
          nodes={nodes}
          selectedNodeId={null}
          editingNodeId={null}
          stageScale={stageScale}
          onNodeChange={noop}
        />
      </Group>
      <NodeTransformer
        ref={transformerRef}
        stageScale={stageScale}
        transformerConfig={transformerConfig}
        transformerEvents={transformerEvents}
      />
    </>
  );
};

export default memo(NodeGroupTransformer);
