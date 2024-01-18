import { ARROW } from '@/constants/shape';
import type Konva from 'konva';
import type { NodeObject, Point } from 'shared';

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

export function calculateMidPointAndPerp(start: Point, end: Point) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  if (dx === 0 && dy === 0) {
    return {
      length: 0,
      mid: { x: start[0], y: start[1] },
      perp: { x: start[0], y: start[1] },
    };
  }

  const length = Math.sqrt(dx ** 2 + dy ** 2);

  const mid = {
    x: (start[0] + end[0]) / 2,
    y: (start[1] + end[1]) / 2,
  };

  const perp = {
    x: dy / length,
    y: -dx / length,
  };

  return { length, mid, perp };
}

export function calculateMinMaxMovementPoints(start: Point, end: Point) {
  const { length, mid, perp } = calculateMidPointAndPerp(start, end);

  const maxDist = length / 2;

  const min = {
    x: mid.x - perp.x * maxDist,
    y: mid.y - perp.y * maxDist,
  };

  const max = {
    x: mid.x + perp.x * maxDist,
    y: mid.y + perp.y * maxDist,
  };

  return { min, max };
}

export function calculateClampedMidPoint(
  dragPosition: Point,
  start: Point,
  end: Point,
) {
  const { mid, perp, length } = calculateMidPointAndPerp(start, end);

  // Calculate the distance of the drag from the midpoint along the perpendicular vector
  let dragDist =
    (dragPosition[0] - mid.x) * perp.x + (dragPosition[1] - mid.y) * perp.y;

  dragDist = Math.max(Math.min(dragDist, length / 2), -length / 2);

  return {
    x: mid.x + dragDist * perp.x,
    y: mid.y + dragDist * perp.y,
  };
}

export function getPoints(node: NodeObject<'arrow'>) {
  const { point, points } = node.nodeProps;

  return [point, ...(points || [point])];
}

export function getBendValue(node: NodeObject<'arrow'>) {
  return node.nodeProps.bend ?? ARROW.DEFAULT_BEND;
}
