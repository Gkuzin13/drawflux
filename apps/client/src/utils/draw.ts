import { type IRect } from 'konva/lib/types';
import { type Point } from 'shared';

export function normalizePoints(p1: Point, p2: Point): Point[] {
  let p1x = p1[0],
    p1y = p1[1],
    p2x = p2[0],
    p2y = p2[1],
    d;

  if (p1x > p2x) {
    d = Math.abs(p1x - p2x);
    p1x = p2x;
    p2x = p1x + d;
  }

  if (p1y > p2y) {
    d = Math.abs(p1y - p2y);
    p1y = p2y;
    p2y = p1y + d;
  }

  return [
    [p1x, p1y],
    [p2x, p2y],
  ];
}

export function drawRectangle(points: [Point, Point]): IRect {
  const [p1, p2] = normalizePoints(points[0], points[1]);

  return {
    x: p1[0],
    y: p1[1],
    width: p2[0] - p1[0],
    height: p2[1] - p1[1],
  };
}
