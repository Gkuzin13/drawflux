import { NodeType, Point } from '@/client/shared/element';

export const getDefaultControlPoint = (start: Point, end: Point): Point => {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
};

export const drawArrow = (node: NodeType, position: Point) => {
  const defaultControlPoint = getDefaultControlPoint(
    node.nodeProps.point,
    position,
  );

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      points: [defaultControlPoint, position],
    },
  };
};
