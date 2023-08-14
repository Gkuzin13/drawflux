import type Konva from 'konva';
import { useCallback } from 'react';
import { Group } from 'react-konva';
import type { NodeObject } from 'shared';
import Node from '@/components/Canvas/Node/Node';
import useForceUpdate from '@/hooks/useForceUpdate/useForceUpdate';
import useTransformer from '@/hooks/useTransformer';
import { getPointsAbsolutePosition } from '@/utils/position';
import NodeTransformer from './NodeTransformer';
import { mapNodesIds } from '@/utils/node';

type Props = {
  nodes: NodeObject[];
  stageScale: number;
  onDragEnd: (nodes: NodeObject[]) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const NodeGroupTransformer = ({ nodes, stageScale, onDragEnd }: Props) => {
  // Solves the issue when a nested group inside a tranformer is not updated properly when changed
  // Forces transformer to rerender with the updated nodes
  const { rerenderCount } = useForceUpdate([nodes]);

  const { transformerRef, nodeRef } = useTransformer<Konva.Group>([
    nodes,
    rerenderCount,
  ]);

  const setVisibility = useCallback(
    (group: Konva.Group, transformer: Konva.Transformer, dragging = false) => {
      const layer = transformer.getLayer();

      if (!layer) {
        return;
      }

      const nodesIds = new Set(mapNodesIds(nodes));

      const selectedLayerNodes = layer.getChildren((child) =>
        nodesIds.has(child.id()),
      );

      selectedLayerNodes.forEach((child) => child.visible(!dragging));

      group.visible(dragging);
      transformer.visible(!dragging);
    },
    [nodes],
  );

  const handleDragStart = useCallback(() => {
    if (!transformerRef.current || !nodeRef.current) return;

    const transformer = transformerRef.current;
    const group = nodeRef.current;

    setVisibility(group, transformer, true);
  }, [setVisibility, nodeRef, transformerRef]);

  const handleDragEnd = useCallback(() => {
    if (!transformerRef.current || !nodeRef.current) return;

    const transformer = transformerRef.current;
    const group = nodeRef.current;
    const stage = group.getStage() as Konva.Stage;
    const children = group.getChildren();

    const nodesMap = new Map(nodes.map((node) => [node.nodeProps.id, node]));

    const updatedNodes = children
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

    onDragEnd(updatedNodes);

    group.position({ x: 0, y: 0 });

    setVisibility(group, transformer);
  }, [nodes, nodeRef, transformerRef, setVisibility, onDragEnd]);

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
        transformerConfig={{
          enabledAnchors: [],
          rotateEnabled: false,
          resizeEnabled: false,
        }}
        transformerEvents={{ onDragEnd: undefined, onDragStart: undefined }}
      />
    </>
  );
};

export default NodeGroupTransformer;
