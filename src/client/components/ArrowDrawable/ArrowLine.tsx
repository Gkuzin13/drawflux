import { ForwardedRef, forwardRef } from 'react';
import Konva from 'konva';
import { NodeColor, Point } from '@/client/shared/element';
import { Line } from 'react-konva';

type Props = {
  points: Point[];
  color: NodeColor;
  dash: number[];
  strokeWidth: number;
};

const ArrowLine = forwardRef(
  (
    { points, color, dash, strokeWidth }: Props,
    ref: ForwardedRef<Konva.Line>,
  ) => {
    const [start, control, end] = points;
    return (
      <Line
        ref={ref}
        stroke={color as string}
        hitStrokeWidth={14}
        lineCap="round"
        strokeWidth={strokeWidth}
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
