import type { IRect, Vector2d } from 'konva/lib/types';
import type { NodeObject, Point } from 'shared';
import { RECT } from '@/constants/shape';

export function getRatioFromValue(value: number, min: number, max: number) {
  return max === min ? 1 : (value - min) / (max - min);
}

export function getValueFromRatio(ratio: number, min: number, max: number) {
  return ratio * (max - min) + min;
}

export function calculateMiddlePoint(rect: IRect): Vector2d {
  return {
    x: rect.x + rect.x + rect.width / 2,
    y: rect.y + rect.y + rect.height / 2,
  };
}

export function clamp(value: number, range: [min: number, max: number]) {
  return Math.min(Math.max(value, range[0]), range[1]);
}

export function calculateLengthFromPoints(points: Point[]) {
  let length = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    length += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }

  return length;
}

export function calculatePerimeter(
  width: number,
  height: number,
  cornerRadius: number,
) {
  return 2 * (height + width - cornerRadius * (4 - Math.PI));
}

export function calculateCircumference(rx: number, ry: number): number {
  const a = rx;
  const b = ry;
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);

  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}

export function getShapeLength(node: NodeObject): number {
  if (Array.isArray(node.nodeProps.points)) {
    return calculateLengthFromPoints([
      node.nodeProps.point,
      ...node.nodeProps.points,
    ]);
  }

  if (node.nodeProps.width && node.nodeProps.height) {
    if (node.type === 'ellipse') {
      return calculateCircumference(
        node.nodeProps.width,
        node.nodeProps.height,
      );
    }
    if (node.type === 'rectangle') {
      return calculatePerimeter(
        node.nodeProps.width,
        node.nodeProps.height,
        RECT.CORNER_RADIUS,
      );
    }
  }

  return 0;
}
