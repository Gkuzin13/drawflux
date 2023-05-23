import type { NodeObject, Point } from 'shared';
import { normalizePoints } from '@/utils/draw';

export const drawArrow = (node: NodeObject, position: Point) => {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      points: [position],
    },
  };
};

export const drawEllipse = (node: NodeObject, position: Point) => {
  const [p1, p2] = normalizePoints(node.nodeProps.point, [
    position[0],
    position[1],
  ]);

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      width: p2[0] - p1[0],
      height: p2[1] - p1[1],
    },
  };
};

export const drawFreePath = (node: NodeObject, position: Point) => {
  const points = node.nodeProps?.points || [];

  return {
    ...node,
    nodeProps: { ...node.nodeProps, points: [...points, position] },
  };
};

export const drawRect = (
  node: NodeObject,
  startPosition: Point,
  currentPosition: Point,
) => {
  const [p1, p2] = normalizePoints(startPosition, [
    currentPosition[0],
    currentPosition[1],
  ]);

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: p1,
      width: p2[0] - p1[0],
      height: p2[1] - p1[1],
    },
  };
};
