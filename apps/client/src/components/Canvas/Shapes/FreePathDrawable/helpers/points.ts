import type { Point } from 'shared';

export function pairPoints(points: number[]): Point[] {
  if (!points.length) {
    return [];
  }

  const pairedPoints: Point[] = [];

  for (let index = 0; index < points.length; index += 2) {
    if (points[index + 1]) {
      pairedPoints.push([points[index], points[index + 1]]);
    }
  }

  return pairedPoints;
}
