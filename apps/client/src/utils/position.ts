import { type Point } from '@shared';
import type Konva from 'konva';

export function getPointsAbsolutePosition<T extends Konva.Node>(
  points: Point[],
  node: T,
  ancestor?: Konva.Node,
): Point[] {
  return points.map((point) => {
    const { x, y } = node.getAbsoluteTransform(ancestor).point({
      x: point[0],
      y: point[1],
    });

    return [x, y];
  });
}
