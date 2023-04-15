import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { createElement, useState } from 'react';
import { Group } from 'react-konva';
import type { NodeObject } from 'shared';
import type { NodeComponentProps } from '@/components/Node/Node';
import { getElement } from '@/constants/element';
import useTransformer from '@/hooks/useTransformer';
import { getPointsAbsolutePosition } from '@/utils/position';
import NodeTransformer from '../NodeTransformer';

type Props = {
  selectedNodes: NodeObject[];
  onDragStart: (nodes: NodeObject[]) => void;
  onDragEnd: (nodes: NodeObject[]) => void;
};

const NodeGroupTransformer = ({
  selectedNodes,
  onDragStart,
  onDragEnd,
}: Props) => {
  const [dragging, setDragging] = useState(false);

  const { transformerRef, nodeRef } = useTransformer<Konva.Group>([
    selectedNodes,
  ]);

  const onGroupDragStart = (event: KonvaEventObject<DragEvent>) => {
    setDragging(true);
    const group = event.target as Konva.Group & Konva.Shape;

    const nodeMap = new Map<string, NodeObject>(
      selectedNodes.map((node) => [node.nodeProps.id, node]),
    );

    const hiddenNodes = group
      .getChildren()
      .map((child) => {
        const node = nodeMap.get(child.attrs.id);

        if (!node) return null;

        return { ...node, nodeProps: { ...node.nodeProps, visible: false } };
      })
      .filter(Boolean) as NodeObject[];

    onDragStart(hiddenNodes);
  };

  const onGroupDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const stage = group.getStage() as Konva.Stage;

    const nodeMap = new Map<string, NodeObject>(
      selectedNodes.map((node) => [node.nodeProps.id, node]),
    );

    const updatedNodes = group
      .getChildren()
      .map((child) => {
        const node = nodeMap.get(child.attrs.id);

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
              visible: true,
            },
          };
        }

        const { x, y } = child.getAbsolutePosition(stage);

        return {
          ...node,
          nodeProps: { ...node.nodeProps, point: [x, y], visible: true },
        };
      })
      .filter(Boolean) as NodeObject[];

    onDragEnd(updatedNodes);
    setDragging(false);
  };

  return (
    <>
      <Group
        ref={nodeRef}
        onDragEnd={onGroupDragEnd}
        onDragStart={onGroupDragStart}
      >
        {selectedNodes.map((node) => {
          return createElement(getElement(node.type), {
            key: node.nodeProps.id,
            node: {
              ...node,
              style: {
                ...node.style,
                opacity: dragging ? 1 : 0,
              },
            },
            selected: false,
            draggable: false,
            onPress: () => null,
            onNodeChange: () => null,
          } as NodeComponentProps);
        })}
      </Group>
      <NodeTransformer
        ref={transformerRef}
        transformerConfig={{ enabledAnchors: [], rotateEnabled: false }}
      />
    </>
  );
};

export default NodeGroupTransformer;
