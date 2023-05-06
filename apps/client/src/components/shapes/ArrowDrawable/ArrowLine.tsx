import type Konva from 'konva';
import { type Context } from 'konva/lib/Context';
import { type Shape } from 'konva/lib/Shape';
import { type LineConfig } from 'konva/lib/shapes/Line';
import { type PropsWithRef, useCallback, useRef, useMemo } from 'react';
import { Line } from 'react-konva';
import type { NodeStyle, NodeLIne, Point } from 'shared';
import useAnimatedLine from '@/hooks/useAnimatedLine';

type Props = PropsWithRef<{
  points: Point[];
  control: Point;
  dash: NodeLIne;
  animated: NodeStyle['animated'];
  config: LineConfig;
}>;

const ArrowLine = ({ dash, animated, points, control, config }: Props) => {
  const lineRef = useRef<Konva.Line>(null);

  const flattenedPoints = useMemo(() => points.flat(), [points]);

  useAnimatedLine({
    enabled: animated,
    elementRef: lineRef,
    totalDashLength: dash[0] + dash[1],
  });

  const [start, end] = points;

  const drawLine = useCallback(
    (ctx: Context, shape: Shape) => {
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);

      ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);

      ctx.fillStrokeShape(shape);
    },
    [start, end, control],
  );

  return (
    <Line
      ref={lineRef}
      {...config}
      dash={dash}
      strokeWidth={config.strokeWidth}
      points={flattenedPoints}
      sceneFunc={drawLine}
    />
  );
};

export default ArrowLine;
