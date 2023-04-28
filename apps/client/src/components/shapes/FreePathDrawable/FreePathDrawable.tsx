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

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        visible: node.nodeProps.visible,
        id: node.nodeProps.id,
        rotation: node.nodeProps.rotation,
        stroke: node.style.color,
        strokeWidth: node.style.size,
        dash: node.style.line,
        opacity: node.style.opacity,
        draggable,
      });
    }, [node.style, node.nodeProps, draggable]);

    const handleDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
        const line = event.target as Konva.Line;
        const stage = line.getStage() as Konva.Stage;

        const points = node.nodeProps.points || [];

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
      [node, onNodeChange],
    );

    const handleTransformEnd = useCallback(
      (event: KonvaEventObject<Event>) => {
        const line = event.target as Konva.Line;
        const stage = line.getStage() as Konva.Stage;

        const points = node.nodeProps.points || [];

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
      [node, onNodeChange],
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
            transformerConfig={{ id: node.nodeProps.id, rotateEnabled: false }}
          />
        )}
      </>
    );
  },
);

FreePathDrawable.displayName = 'FreePathDrawable';

export default FreePathDrawable;
