import { ARROW } from '@/constants/shape';
import type Konva from 'konva';
import type { Point } from 'shared';

export function drawArrowHead(
  ctx: Konva.Context,
  shape: Konva.Shape,
  points: [start: Point, control: Point],
) {
  const PI2 = Math.PI * 2;
  const [start, control] = points;
  const dx = start[0] - control[0];
  const dy = start[1] - control[1];

  const stageScale = shape.getStage()?.scaleX() ?? 1;
  const length = (ARROW.HEAD_LENGTH / stageScale) * shape.strokeWidth();
  const width = (ARROW.HEAD_WIDTH / stageScale) * shape.strokeWidth();

  const radians = (Math.atan2(dy, dx) + PI2) % PI2;

  ctx.setAttr('strokeStyle', shape.stroke());
  ctx.setAttr('lineWidth', shape.strokeWidth() / stageScale);
  ctx.setAttr('lineCap', 'round');

  ctx.save();

  ctx.beginPath();
  ctx.translate(start[0], start[1]);
  ctx.rotate(radians);

  ctx.moveTo(0, 0);
  ctx.lineTo(-length, width / 2);

  ctx.moveTo(0, 0);
  ctx.lineTo(-length, -width / 2);

  ctx.restore();
  
  ctx.stroke();
}
