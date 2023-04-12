import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useMemo } from 'react';
import { Line } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import { createDefaultNodeConfig } from '@/constants/element';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import useTransformer from '@/hooks/useTransformer';
import { getPointsAbsolutePosition } from '@/utils/position';
import NodeTransformer from '../../NodeTransformer';

const FreePathDrawable = memo(
  ({
    node,
    draggable,
    selected,
    onNodeChange,
    onPress,
  }: NodeComponentProps) => {
    const { nodeRef, transformerRef } = useTransformer<Konva.Line>([selected]);

    useAnimatedLine(
      nodeRef.current,
      node.style.line[0] + node.style.line[1],
      node.style.animated,
      node.style.line,
    );

    const flattenedPoints = useMemo(() => {
      return node.nodeProps.points?.flat() || [];
    }, [node.nodeProps.points]);

    const { nodeProps, style } = node;

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        visible: nodeProps.visible,
        id: nodeProps.id,
        rotation: nodeProps.rotation,
        stroke: style.color,
        strokeWidth: style.size,
        dash: style.line,
        opacity: style.opacity,
        draggable,
      });
    }, [style, nodeProps, draggable]);

    const handleDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        const line = event.target as Konva.Line;
        const stage = line.getStage() as Konva.Stage;

        const points = nodeProps.points || [];

        const updatedPoints = getPointsAbsolutePosition(points, line, stage);

        onNodeChange({
          ...node,
          nodeProps: {
            ...node.nodeProps,
            points: updatedPoints,
          },
        });

        line.position({ x: 0, y: 0 });
      },
      [node, nodeProps.points, onNodeChange],
    );

    const handleTransformEnd = useCallback(
      (event: KonvaEventObject<Event>) => {
        const line = event.target as Konva.Line;
        const stage = line.getStage() as Konva.Stage;

        const points = nodeProps.points || [];

        const updatedPoints = getPointsAbsolutePosition(points, line, stage);

        onNodeChange({
          ...node,
          nodeProps: {
            ...node.nodeProps,
            points: updatedPoints,
          },
        });

        line.scale({ x: 1, y: 1 });
        line.position({ x: 0, y: 0 });
      },
      [node, nodeProps.points, onNodeChange],
    );

    return (
      <>
        <Line
          ref={nodeRef}
          points={flattenedPoints}
          {...config}
          onDragStart={() => onPress(node.nodeProps.id)}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        />
        {selected && (
          <NodeTransformer
            ref={transformerRef}
            transformerConfig={{ rotateEnabled: false }}
          />
        )}
      </>
    );
  },
);

FreePathDrawable.displayName = 'FreePathDrawable';

export default FreePathDrawable;
