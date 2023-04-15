import type Konva from 'konva';
import { type Point } from 'shared';

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
