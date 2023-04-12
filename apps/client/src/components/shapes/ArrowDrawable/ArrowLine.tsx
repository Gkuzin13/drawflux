import { type NodeLIne, type Point } from '@shared/types';
import type Konva from 'konva';
import { type Context } from 'konva/lib/Context';
import { type Shape } from 'konva/lib/Shape';
import { type LineConfig } from 'konva/lib/shapes/Line';
import { type PropsWithRef, forwardRef, useCallback } from 'react';
import { Line } from 'react-konva';

type Props = PropsWithRef<{
  points: Point[];
  control: Point;
  dash: NodeLIne;
  config: LineConfig;
}>;

type Ref = Konva.Line;

const ArrowLine = forwardRef<Ref, Props>(
  ({ dash, points, control, config }, ref) => {
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
        ref={ref}
        {...config}
        dash={dash}
        points={[...points.flat()]}
        sceneFunc={drawLine}
      />
    );
  },
);

ArrowLine.displayName = 'ArrowLine';

export default ArrowLine;
