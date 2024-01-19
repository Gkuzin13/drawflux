import { memo, useCallback } from 'react';
import { Group } from 'react-konva';
import useTransformer from '@/hooks/useTransformer';
import NodeTransformer from './NodeTransformer';
import Node from '../Node/Node';
import { getPointsAbsolutePosition } from '@/utils/position';
import { mapNodesIds } from '@/utils/node';
import { noop } from '@/utils/is';
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

function setSelectedNodesVisibility(
  layer: Konva.Layer | null,
  selectedNodes: NodeObject[],
  visible: boolean,
) {
  if (!layer) {
    return;
  }

  const nodesIds = new Set(mapNodesIds(selectedNodes));

  const selectedLayerNodes = layer.getChildren((child) =>
    nodesIds.has(child.id()),
  );

  selectedLayerNodes.forEach((child) => {
    child.visible(visible);
    child.listening(visible);
  });
}

const NodeGroupTransformer = ({ nodes, stageScale, onNodesChange }: Props) => {
  const { transformerRef, nodeRef } = useTransformer<Konva.Group>([nodes]);

  const handleDragStart = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const group = event.target as Konva.Group;

      group.visible(true);
      setSelectedNodesVisibility(group.getLayer(), nodes, false);
    },
    [nodes],
  );

  const handleDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const group = event.target as Konva.Group;
      const stage = group.getStage();

      if (!group || !stage) {
        return;
      }

      const childrenMap = new Map(
        group.getChildren().map((child) => [child.id(), child]),
      );

      const updatedNodes: NodeObject[] = nodes.map((node) => {
        const nodeInGroup = childrenMap.get(node.nodeProps.id);

        if (!nodeInGroup) return node;

        if (node.nodeProps.points) {
          const points = [node.nodeProps.point, ...node.nodeProps.points];

          const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
            points,
            nodeInGroup,
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

        const { x, y } = nodeInGroup.getAbsolutePosition(stage);

        return {
          ...node,
          nodeProps: { ...node.nodeProps, point: [x, y] },
        };
      });

      onNodesChange(updatedNodes);

      setSelectedNodesVisibility(group.getLayer(), nodes, true);

      group.visible(false);
      group.position({ x: 0, y: 0 });
    },
    [nodes, onNodesChange],
  );

  return (
    <>
      <Group
        ref={nodeRef}
        visible={false}
        draggable={true}
        listening={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {nodes.map((node) => {
          return (
            <Node
              key={node.nodeProps.id}
              node={node}
              selected={false}
              stageScale={stageScale}
              onNodeChange={noop}
            />
          );
        })}
      </Group>
      <NodeTransformer
        ref={transformerRef}
        stageScale={stageScale}
        transformerConfig={transformerConfig}
      />
    </>
  );
};

export default memo(NodeGroupTransformer);
