import { NodeType, Point } from '@/client/shared/constants/element';
import { normalizePoints } from '@/client/shared/utils/draw';

export const drawEllipse = (node: NodeType, position: Point) => {
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
