import { type Point } from '@shared/types';

export function calcMidPointAndPerp(start: Point, end: Point) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

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

export function calcMinMaxMovementPoints(start: Point, end: Point) {
  const { length, mid, perp } = calcMidPointAndPerp(start, end);

  const maxDist = length / 2;

  const minPoint = {
    x: mid.x - perp.x * maxDist,
    y: mid.y - perp.y * maxDist,
  };

  const maxPoint = {
    x: mid.x + perp.x * maxDist,
    y: mid.y + perp.y * maxDist,
  };

  return { minPoint, maxPoint };
}
