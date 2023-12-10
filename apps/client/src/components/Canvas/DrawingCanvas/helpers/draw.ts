import type { DrawableNodeType, NodeObject, Point } from 'shared';
import { RECT } from '@/constants/shape';
import { normalizePoints } from '@/utils/draw';

export type DrawPosition = {
  start: Point;
  current: Point;
};

export type DrawFunctionArgs = {
  node: NodeObject;
  position: DrawPosition;
};

export type DrawFunctionsMap = Record<
  DrawableNodeType,
  (args: DrawFunctionArgs) => NodeObject
>;

export function drawArrow({ node, position }: DrawFunctionArgs): NodeObject {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: position.start,
      points: [position.current],
    },
  };
}

export function drawEllipse({ node, position }: DrawFunctionArgs): NodeObject {
  const [p1, p2] = normalizePoints(position.start, position.current);

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      width: p2[0] - p1[0],
      height: p2[1] - p1[1],
    },
  };
}

export function drawFreePath({ node, position }: DrawFunctionArgs): NodeObject {
  const points = node.nodeProps?.points || [];

  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: position.start,
      points: [...points, position.current],
    },
  };
}

export function drawRect({ node, position }: DrawFunctionArgs): NodeObject {
  const [p1, p2] = normalizePoints(position.start, [
    position.current[0],
    position.current[1],
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

export function drawLaser({ node, position }: DrawFunctionArgs): NodeObject {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: position.start,
      points: [position.current],
    },
  };
}

export const drawFunctionsMap: DrawFunctionsMap = {
  arrow: drawArrow,
  ellipse: drawEllipse,
  rectangle: drawRect,
  draw: drawFreePath,
  laser: drawLaser,
};

export function drawNodeByType({
  node,
  position,
}: DrawFunctionArgs): NodeObject {
  if (node.type === 'text') {
    return node;
  }

  const drawFunction = drawFunctionsMap[node.type];

  return drawFunction({ node, position });
}
