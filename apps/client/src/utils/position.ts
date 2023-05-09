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

export function getWidthFromPoints(points: Point[]): number {
  if (!points.length) {
    return 0;
  }

  const xPoints = points.map(([x]) => x);
  const maxX = Math.max(...xPoints);
  const minX = Math.min(...xPoints);

  return Math.abs(maxX - minX);
}
