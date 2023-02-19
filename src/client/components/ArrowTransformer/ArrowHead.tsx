import { NodeColor, Point } from '@/client/shared/element';
import { Line } from 'react-konva';

type Props = {
  endPosition: Point;
  headRotationPosition: Point;
  color: NodeColor;
  strokeWidth: number;
};

const ArrowHead = ({
  endPosition,
  headRotationPosition,
  color,
  strokeWidth,
}: Props) => {
  const PI2 = Math.PI * 2;

  return (
    <Line
      stroke={color as string}
      hitStrokeWidth={14}
      strokeWidth={strokeWidth}
      lineCap="round"
      sceneFunc={(ctx, shape) => {
        const dx = endPosition.x - headRotationPosition.x;
        const dy = endPosition.y - headRotationPosition.y;

        const radians = (Math.atan2(dy, dx) + PI2) % PI2;
        const length = 2.8 * strokeWidth;
        const width = 2.8 * strokeWidth;

        ctx.save();

        ctx.beginPath();
        ctx.translate(endPosition.x, endPosition.y);
        ctx.rotate(radians);

        ctx.moveTo(0, 0);
        ctx.lineTo(-length, width / 2);

        ctx.moveTo(0, 0);
        ctx.lineTo(-length, -width / 2);

        ctx.restore();
        ctx.setLineDash([0, 0]);
        ctx.fillStrokeShape(shape);
      }}
    />
  );
};

export default ArrowHead;
