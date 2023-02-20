import { ForwardedRef, forwardRef } from 'react';
import Konva from 'konva';
import { NodeColor, Point } from '@/client/shared/element';
import { Line } from 'react-konva';

type Props = {
  start: Point;
  end: Point;
  control?: Point;
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
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(
            control ? control.x : start.x,
            control ? control.y : start.y,
            end.x,
            end.y,
          );

          ctx.fillStrokeShape(shape);
        }}
      />
    );
  },
);

ArrowLine.displayName = 'ArrowLine';

export default ArrowLine;
