import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { LineConfig } from 'konva/lib/shapes/Line';
import { ForwardedRef, forwardRef } from 'react';
import { Line } from 'react-konva';

type Props = {
  points: Point[];
  control: Point;
  dash: number[];
  config: LineConfig;
};

const ArrowLine = forwardRef(
  ({ dash, points, control, config }: Props, ref: ForwardedRef<Konva.Line>) => {
    const [start, end] = points;

    return (
      <Line
        ref={ref}
        {...config}
        dash={dash}
        points={[...points.flat()]}
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(start[0], start[1]);

          ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);

          ctx.fillStrokeShape(shape);
        }}
      />
    );
  },
);

ArrowLine.displayName = 'ArrowLine';

export default ArrowLine;
