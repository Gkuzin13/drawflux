import type { Context } from 'konva/lib/Context';
import type { Shape } from 'konva/lib/Shape';
import type { Point } from 'shared';

export function drawLine(
  ctx: Context,
  shape: Shape,
  points: Point[],
  control: Point,
) {
  const [start, end] = points;
  const [controlX, controlY] = control;

  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);

  ctx.quadraticCurveTo(controlX, controlY, end[0], end[1]);

  ctx.fillStrokeShape(shape);
}

export function drawArrowHead(
  ctx: Context,
  shape: Shape,
  controlPoint: Point,
  endPoint: Point,
  strokWidth: number,
) {
  const PI2 = Math.PI * 2;
  const dx = endPoint[0] - controlPoint[0];
  const dy = endPoint[1] - controlPoint[1];

  const radians = (Math.atan2(dy, dx) + PI2) % PI2;
  const length = 3 * strokWidth;
  const width = 4 * strokWidth;

  ctx.save();

  ctx.beginPath();
  ctx.rotate(radians);

  ctx.moveTo(0, 0);
  ctx.lineTo(-length, width / 2);

  ctx.moveTo(0, 0);
  ctx.lineTo(-length, -width / 2);

  ctx.restore();
  ctx.fillStrokeShape(shape);
}
