import type Konva from 'konva';
import { type NodeConfig } from 'konva/lib/Node';
import { memo, useCallback } from 'react';
import { Shape } from 'react-konva';
import { type Point } from 'shared';

type Props = {
  control: Point;
  end: Point;
  config: NodeConfig;
};

const ArrowHead = ({ control, end, config }: Props) => {
  const drawHead = useCallback(
    (ctx: Konva.Context, shape: Konva.Shape) => {
      const PI2 = Math.PI * 2;
      const dx = end[0] - control[0];
      const dy = end[1] - control[1];

      const radians = (Math.atan2(dy, dx) + PI2) % PI2;
      const length = 3 * config.strokeWidth;
      const width = 4 * config.strokeWidth;

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
    },
    [config.strokeWidth, control, end],
  );

  return <Shape {...config} sceneFunc={drawHead} />;
};

export default ArrowHead;
