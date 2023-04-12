import { type NodeObject, type Point } from '@shared/types';

export const getDefaultControlPoint = (start: Point, end: Point): Point => {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
};

export const drawArrow = (node: NodeObject, position: Point) => {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      points: [position],
    },
  };
};
