import { NodeType, Point } from '@/client/shared/element';
import { normalizePoints } from '@/client/shared/utils/draw';

export const drawRect = (
  node: NodeType,
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
