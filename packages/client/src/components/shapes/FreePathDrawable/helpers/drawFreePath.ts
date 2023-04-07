import type { NodeObject, Point } from '@shared';

export const drawFreePath = (node: NodeObject, position: Point) => {
  const points = node.nodeProps?.points || [];

  return {
    ...node,
    nodeProps: { ...node.nodeProps, points: [...points, position] },
  };
};
