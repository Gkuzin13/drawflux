import { useCallback, useRef } from 'react';
import { Line } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { calculateLengthFromPoints } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import { pairPoints } from './helpers/points';
import { FREE_PATH } from '@/constants/shape';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const FreePathDrawable = ({ node, stageScale }: NodeComponentProps<'draw'>) => {
  const nodeRef = useRef<Konva.Line>(null);

  const { config } = useNode(node, stageScale);
  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const flattenedPoints = (node.nodeProps.points ?? []).flat();

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

  const handleTransformEnd = useCallback(() => {
    if (node.style.animated && animation?.isRunning() === false) {
      animation.start();
    }
  }, [node, animation]);

  return (
    <Line
      ref={nodeRef}
      points={flattenedPoints}
      {...config}
      tension={FREE_PATH.TENSION}
      bezier={true}
      onTransformStart={handleTransformStart}
      onTransform={handlTransform}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default FreePathDrawable;
