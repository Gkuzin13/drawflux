import { ARROW } from '@/constants/shape';
import type { NodeObject, Point } from 'shared';

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
