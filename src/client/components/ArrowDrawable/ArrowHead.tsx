import { NodeColor, Point } from '@/client/shared/element';
import { Shape } from 'react-konva';

type Props = {
  end: Point;
  control: Point;
  color: NodeColor;
  strokeWidth: number;
};

const ArrowHead = ({ end, control, color, strokeWidth }: Props) => {
  const PI2 = Math.PI * 2;

  return (
    <Shape
      stroke={color as string}
      hitStrokeWidth={14}
      strokeWidth={strokeWidth}
      lineCap="round"
      sceneFunc={(ctx, shape) => {
        const dx = end[0] - control[0];
        const dy = end[1] - control[1];

        const radians = (Math.atan2(dy, dx) + PI2) % PI2;
        const length = 2.8 * strokeWidth;
        const width = 2.8 * strokeWidth;

        ctx.save();

        ctx.beginPath();
        ctx.translate(end[0], end[1]);
        ctx.rotate(radians);

        ctx.moveTo(0, 0);
        ctx.lineTo(-length, width / 2);

        ctx.moveTo(0, 0);
        ctx.lineTo(-length, -width / 2);

        ctx.restore();
        ctx.fillStrokeShape(shape);
      }}
    />
  );
};

export default ArrowHead;
