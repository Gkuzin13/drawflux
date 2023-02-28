import Konva from 'konva';
import { Point } from '../element';

export function getPointsAbsolutePosition<T extends Konva.Node>(
  points: Point[],
  shape: T,
): Point[] {
  return points.map((point) => {
    const { x, y } = shape.getAbsoluteTransform().point({
      x: point[0],
      y: point[1],
    });

    return [x, y];
  });
}
