import type { NodeLine, NodeObject, Point } from 'shared';
import { RECT } from '@/constants/node';

export function getDashValue(
  shapeLength: number,
  strokeWidth: number,
  lineStyle: NodeLine,
) {
  let ratio = 1;
  let dashLength = 0;
  let dashGap = 0;

  switch (lineStyle) {
    case 'dashed':
      dashLength = Math.min(strokeWidth * 2, shapeLength / 4);
      break;
    case 'dotted':
      ratio = 8;
      dashLength = strokeWidth / ratio;
      break;
    default:
      return [];
  }

  let dashCount = Math.floor(shapeLength / dashLength / (2 * ratio));
  dashCount = Math.max(dashCount, 3);

  dashLength = shapeLength / dashCount / (2 * ratio);
  dashGap = (shapeLength - dashCount * dashLength) / dashCount;

  return [dashLength, dashGap];
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
