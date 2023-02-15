import { Point } from '../element';

export function getNormalizedPoints(
  p1: Point,
  p2: Point,
): { p1: Point; p2: Point } {
  let p1x = p1.x;
  let p1y = p1.y;
  let p2x = p2.x;
  let p2y = p2.y;
  let d;

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

  return { p1: { x: p1x, y: p1y }, p2: { x: p2x, y: p2y } };
}
