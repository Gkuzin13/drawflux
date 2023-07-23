import type Konva from 'konva';
import type { IRect, Vector2d } from 'konva/lib/types';
import type { NodeObject, Point } from 'shared';
import { calculateMiddlePoint } from './math';

export function getPointsAbsolutePosition<T extends Konva.Node>(
  points: Point[],
  node: T,
  ancestor?: Konva.Node,
): Point[] {
  return points.map((point) => {
    const { x, y } = node.getAbsoluteTransform(ancestor).point({
      x: point[0],
      y: point[1],
    });

    return [x, y];
  });
}

export function getNodeRect(node: NodeObject): IRect {
  if (node.nodeProps.points) {
    const points = [...node.nodeProps.points, node.nodeProps.point];
    const xPoints = points.map(([x]) => x);
    const yPoints = points.map(([_, y]) => y);

    const minX = Math.min(...xPoints);
    const minY = Math.min(...yPoints);
    const maxX = Math.max(...xPoints);
    const maxY = Math.max(...yPoints);

    return {
      x: minX,
      y: minY,
      width: Math.abs(maxX - minX),
      height: Math.abs(maxY - minY),
    };
  }

  let width = node.nodeProps.width || 0;
  let height = node.nodeProps.height || 0;

  if (node.type === 'ellipse') {
    width *= 2;
    height *= 2;
  }

  return {
    x: node.nodeProps.point[0],
    y: node.nodeProps.point[1],
    width,
    height,
  };
}

export function getVisibleBoundaries(rect: IRect, scale: number): IRect {
  return {
    x: -rect.x / scale,
    y: -rect.y / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  };
}

export function isNodeFullyInView(
  node: NodeObject,
  stageRect: IRect,
  stageScale: number,
): boolean {
  const visibleBoundaries = getVisibleBoundaries(stageRect, stageScale);
  const nodeRect = getNodeRect(node);

  return (
    nodeRect.x >= visibleBoundaries.x &&
    nodeRect.y >= visibleBoundaries.y &&
    nodeRect.x + nodeRect.width <=
      visibleBoundaries.x + visibleBoundaries.width &&
    nodeRect.y + nodeRect.height <=
      visibleBoundaries.y + visibleBoundaries.height
  );
}

export function getMiddleNode(nodes: NodeObject[]): NodeObject | null {
  if (!nodes.length) {
    return null;
  }

  if (nodes.length <= 2) {
    return nodes[0];
  }

  const nodesCopy = [...nodes];

  const sortedNodesByPosAsc = nodesCopy.sort((a, b) => {
    const aMid = calculateMiddlePoint(getNodeRect(a));
    const bMid = calculateMiddlePoint(getNodeRect(b));

    if (aMid.x < bMid.x) {
      return -1;
    }

    if (aMid.x > bMid.x) {
      return 1;
    }

    if (aMid.y < bMid.y) {
      return -1;
    }

    if (aMid.y > bMid.y) {
      return 1;
    }

    return 0;
  });

  const midIndex = Math.round((sortedNodesByPosAsc.length - 1) / 2);

  return sortedNodesByPosAsc[midIndex];
}

export function getCenterPosition(
  position: Vector2d,
  scale: number,
  width: number,
  height: number,
) {
  return {
    x: -position.x * scale + width / 2,
    y: -position.y * scale + height / 2,
  };
}

export function getNormalizedInvertedRect(rect: IRect, scale: number): IRect {
  return {
    x: -rect.x / scale,
    y: -rect.y / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  };
}

export function calculateDuplicationDistance(
  nodes: NodeObject[],
  gap = 0,
): number {
  const nodeMinXEdge = Math.min(...nodes.map((node) => getNodeRect(node).x));
  const nodeMaxXEdge = Math.max(
    ...nodes.map((node) => {
      const { x, width } = getNodeRect(node);
      return x + width;
    }),
  );

  const duplicationStartXPoint = nodeMaxXEdge + gap;
  const distance = duplicationStartXPoint - nodeMinXEdge;

  return distance;
}
