import { NodeType, Point } from '@/client/shared/element';

export const drawFreePath = (node: NodeType, position: Point) => {
  const points = node.nodeProps?.points || [];

  return {
    ...node,
    nodeProps: { ...node.nodeProps, points: [...points, position] },
  };
};
