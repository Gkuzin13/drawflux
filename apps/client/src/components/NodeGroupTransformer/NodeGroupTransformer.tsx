import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { createElement, useCallback, useState } from 'react';
import { Group } from 'react-konva';
import type { NodeObject } from 'shared';
import type { NodeComponentProps } from '@/components/Node/Node';
import { getElement } from '@/constants/element';
import useTransformer from '@/hooks/useTransformer';
import { getPointsAbsolutePosition } from '@/utils/position';
import NodeTransformer from '../NodeTransformer';

type Props = {
  selectedNodes: NodeObject[];
  onDragEnd: (nodes: NodeObject[]) => void;
};

const NodeGroupTransformer = ({ selectedNodes, onDragEnd }: Props) => {
  const [dragging, setDragging] = useState(false);

  const { transformerRef, nodeRef } = useTransformer<Konva.Group>([
    selectedNodes,
  ]);

  const onGroupDragStart = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const layerChildren = group.getLayer()?.getChildren();

    toggleDraggedNodesVisibility(layerChildren, false);
    setDragging(true);
  };

  const onGroupDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const stage = group.getStage() as Konva.Stage;

    const layerChildren = group.getLayer()?.getChildren();

    toggleDraggedNodesVisibility(layerChildren, true);

    const updatedNodes = group
      .getChildren()
      .map((child) => {
        const node = selectedNodes.find(
          (node) => node.nodeProps.id === child.id(),
        );

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
    setDragging(false);
  };

  const toggleDraggedNodesVisibility = useCallback(
    (layerChildren: Konva.Group['children'], visibile: boolean) => {
      for (const node of selectedNodes) {
        const child = layerChildren?.find(
          (child) => child.id() === node.nodeProps.id,
        );

        if (child) {
          child.opacity(visibile ? 1 : 0);
        }
      }
    },
    [selectedNodes],
  );

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
