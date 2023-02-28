import { getElement, NodeType, Point } from '@/client/shared/element';
import { getPointsAbsolutePosition } from '@/client/shared/utils/position';
import { useAppDispatch } from '@/client/stores/hooks';
import { nodesActions } from '@/client/stores/nodesSlice';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { createElement, useEffect, useRef } from 'react';
import { Group } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import { NodeComponentProps } from '../types';

type Props = {
  selectedNodes: NodeType[];
};

const NodeGroupTransformer = ({ selectedNodes }: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRef = useRef(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedNodes && transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNodes]);

  const onGroupDragStart = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const nodeMap = new Map<string, NodeType>();

    selectedNodes.forEach((node) => nodeMap.set(node.nodeProps.id, node));

    const hiddenNodes = group
      .getChildren()
      .map((child) => {
        const node = nodeMap.get(child.attrs.id);

        if (!node) return null;

        return { ...node, nodeProps: { ...node.nodeProps, visible: false } };
      })
      .filter(Boolean) as NodeType[];

    dispatch(nodesActions.update(hiddenNodes));
  };

  const onGroupDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const nodeMap = new Map<string, NodeType>();

    selectedNodes.forEach((node) => nodeMap.set(node.nodeProps.id, node));

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

        const { x, y } = child.getAbsolutePosition();

        return {
          ...node,
          nodeProps: { ...node.nodeProps, point: [x, y], visible: true },
        };
      })
      .filter(Boolean) as NodeType[];
    console.log(updatedNodes);
    dispatch(nodesActions.update(updatedNodes));
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
            key: `group-${node.nodeProps.id}`,
            node,
            selected: false,
            draggable: false,
            onSelect: () => null,
            onNodeChange: () => null,
          } as NodeComponentProps);
        })}
      </Group>
      <NodeTransformer
        ref={transformerRef}
        transformerConfig={{ enabledAnchors: [] }}
      />
    </>
  );
};

export default NodeGroupTransformer;
