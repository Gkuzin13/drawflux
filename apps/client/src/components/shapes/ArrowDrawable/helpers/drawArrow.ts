import type { NodeObject, Point } from 'shared';

export const drawArrow = (node: NodeObject, position: Point) => {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      points: [position],
    },
  };
};
