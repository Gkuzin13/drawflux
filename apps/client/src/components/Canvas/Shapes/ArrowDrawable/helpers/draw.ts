import { ARROW } from '@/constants/shape';
import type Konva from 'konva';
import type { Point } from 'shared';

const PI2 = Math.PI * 2;

export function drawArrowHead(ctx: Konva.Context, shape: Konva.Shape) {
  const points = getPointsAttr(shape);
  const [control, end] = [points[1], points[2]];
  const stageScale = shape.getStage()?.scaleX() ?? 1;
  const strokeWidth = shape.strokeWidth();

  const dx = end[0] - control[0];
  const dy = end[1] - control[1];

  const radians = (Math.atan2(dy, dx) + PI2) % PI2;
  const length = (ARROW.HEAD_LENGTH / stageScale) * strokeWidth;
  const width = (ARROW.HEAD_WIDTH / stageScale) * strokeWidth;

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
}

export function drawArrowLine(ctx: Konva.Context, shape: Konva.Shape) {
  const line = shape as Konva.Line;
  const [startX, startY, controlX, controlY, endX, endY] = line.points();

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(startX, startY);

  ctx.quadraticCurveTo(controlX, controlY, endX, endY);

  ctx.restore();

  ctx.fillStrokeShape(shape);
}

function getPointsAttr(shape: Konva.Shape) {
  return shape.attrs.points as [start: Point, control: Point, end: Point];
}
