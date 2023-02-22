import { ForwardedRef, forwardRef } from 'react';
import Konva from 'konva';
import { NodeColor, Point } from '@/client/shared/element';
import { Line } from 'react-konva';

type Props = {
  start: Point;
  end: Point;
  control: Point;
  color: NodeColor;
  dash: number[];
  strokeWidth: number;
};

const ArrowLine = forwardRef(
  (
    { start, end, control, color, dash, strokeWidth }: Props,
    ref: ForwardedRef<Konva.Line>,
  ) => {
    return (
      <Line
        ref={ref}
        stroke={color as string}
        hitStrokeWidth={14}
        lineCap="round"
        strokeWidth={strokeWidth}
        dash={dash}
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
