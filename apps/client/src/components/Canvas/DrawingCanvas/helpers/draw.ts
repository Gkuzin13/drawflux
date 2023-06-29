import type { NodeObject, NodeType, Point } from 'shared';
import { RECT } from '@/constants/node';
import { normalizePoints } from '@/utils/draw';

export function drawArrow(
  node: NodeObject,
  startPosition: Point,
  currentPosition: Point,
): NodeObject {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: startPosition,
      points: [currentPosition],
    },
  };
}

export function drawEllipse(
  node: NodeObject,
  startPosition: Point,
  currentPosition: Point,
): NodeObject {
  const [p1, p2] = normalizePoints(startPosition, currentPosition);

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      width: p2[0] - p1[0],
      height: p2[1] - p1[1],
    },
  };
}

export function drawFreePath(
  node: NodeObject,
  startPosition: Point,
  currentPosition: Point,
): NodeObject {
  const points = node.nodeProps?.points || [];

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: startPosition,
      points: [...points, currentPosition],
    },
  };
}

export function drawRect(
  node: NodeObject,
  startPosition: Point,
  currentPosition: Point,
): NodeObject {
  const [p1, p2] = normalizePoints(startPosition, [
    currentPosition[0],
    currentPosition[1],
  ]);

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: p1,
      width: Math.max(p2[0] - p1[0], RECT.MIN_SIZE),
      height: Math.max(p2[1] - p1[1], RECT.MIN_SIZE),
    },
  };
}

export type DrawableType = Exclude<NodeType, 'text'>;

type DrawType = {
  [key in DrawableType]: (
    node: NodeObject,
    startPosition: Point,
    currentPosition: Point,
  ) => NodeObject;
};

export const drawTypes: DrawType = {
  arrow: drawArrow,
  ellipse: drawEllipse,
  rectangle: drawRect,
  draw: drawFreePath,
};
