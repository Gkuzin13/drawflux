import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useMemo } from 'react';
import { Line } from 'react-konva';
import type { NodeComponentProps } from '@/components/Node/Node';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
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
    const { stageConfig } = useAppSelector(selectCanvas);

    const { totalDashLength, config } = useNode(node, stageConfig);

    useAnimatedDash({
      enabled: node.style.animated,
      elementRef: nodeRef,
      totalDashLength,
    });

    const flattenedPoints = useMemo(() => {
      return node.nodeProps.points?.flat() || [];
    }, [node.nodeProps.points]);

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

        onPress(node.nodeProps.id);
      },
      [node, onNodeChange, onPress],
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
          draggable={draggable}
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
