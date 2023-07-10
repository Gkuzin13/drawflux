import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
import { Line } from 'react-konva';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import { calculateLengthFromPoints } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue } from '@/utils/shape';
import NodeTransformer from '../../Transformer/NodeTransformer';
import { pairPoints } from './helpers/points';

const FreePathDrawable = ({
  node,
  draggable,
  selected,
  onNodeChange,
  onPress,
}: NodeComponentProps) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Line>([selected]);
  const { stageConfig } = useAppSelector(selectCanvas);
  const { config } = useNode(node, stageConfig);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    elementRef: nodeRef,
    totalDashLength: config.dash[0] + config.dash[1],
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

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation?.isRunning()) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handlTransform = useCallback(
    (event: KonvaEventObject<Event>) => {
      const line = event.target as Konva.Line;
      const stage = line.getStage() as Konva.Stage;
      const points = [line.x(), line.y(), ...line.points()];

      const pairedPoints = pairPoints(points);
      const updatedPoints = getPointsAbsolutePosition(
        pairedPoints,
        line,
        stage,
      );

      const totalLength = calculateLengthFromPoints(updatedPoints);

      const dash = getDashValue(
        totalLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      line.dash(dash.map((d) => d * stageConfig.scale));
    },
    [node.style.size, node.style.line, stageConfig.scale],
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

      if (node.style.animated && animation?.isRunning() === false) {
        animation.stop();
      }
    },
    [node, animation, onNodeChange],
  );

  return (
    <>
      <Line
        ref={nodeRef}
        points={flattenedPoints}
        {...config}
        draggable={draggable}
        onDragEnd={handleDragEnd}
        onTransformStart={handleTransformStart}
        onTransform={handlTransform}
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
};

export default FreePathDrawable;
