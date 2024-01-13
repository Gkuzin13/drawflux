import { memo, useCallback } from 'react';
import { Line } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import useTransformer from '@/hooks/useTransformer';
import { calculateLengthFromPoints } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import NodeTransformer from '../../Transformer/NodeTransformer';
import { pairPoints } from './helpers/points';
import { FREE_PATH } from '@/constants/shape';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const FreePathDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'draw'>) => {
  const { nodeRef, transformerRef } = useTransformer<Konva.Line>([selected]);

  const { config } = useNode(node, stageScale);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const flattenedPoints = (node.nodeProps.points ?? []).flat();

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

      line.dash(dash.map((d) => d * stageScale));
    },
    [node.style.size, node.style.line, stageScale],
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
        animation.start();
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
        tension={FREE_PATH.TENSION}
        bezier={true}
        onDragEnd={handleDragEnd}
        onTransformStart={handleTransformStart}
        onTransform={handlTransform}
        onTransformEnd={handleTransformEnd}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          stageScale={stageScale}
          transformerConfig={{ rotateEnabled: false }}
        />
      )}
    </>
  );
};

export default memo(FreePathDrawable);
