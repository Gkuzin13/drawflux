import { calculateMiddlePoint } from './math';
import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import type { NodeObject, Point } from 'shared';

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

export function getNodesMinMaxPoints(nodes: NodeObject[]) {
  if (!nodes.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };

  for (const node of nodes) {
    const { x, y, width, height } = getNodeRect(node);

    if (x < bounds.minX) {
      bounds.minX = x;
    }

    if (y < bounds.minY) {
      bounds.minY = y;
    }

    if (x + width > bounds.maxX) {
      bounds.maxX = x + width;
    }

    if (y + height > bounds.maxY) {
      bounds.maxY = y + height;
    }
  }

  return bounds;
}

export function getNodeRect(node: NodeObject): IRect {
  const [x, y] = node.nodeProps.point;

  if (node.nodeProps.points) {
    const points = [...node.nodeProps.points, [x, y]];
    const { xPoints, yPoints } = points.reduce(
      (acc, point) => {
        acc.xPoints.push(point[0]);
        acc.yPoints.push(point[1]);

        return acc;
      },
      { xPoints: [] as number[], yPoints: [] as number[] },
    );

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

  const width = node.nodeProps.width ?? 0;
  const height = node.nodeProps.height ?? 0;

  if (node.type === 'ellipse') {
    return {
      x: x - width,
      y: y - height,
      width: width * 2,
      height: height * 2,
    };
  }

  return { x, y, width, height };
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

export function isNodePartiallyInView(
  nodeRect: IRect,
  stageRect: IRect,
  stageScale: number,
): boolean {
  const visibleBoundaries = getVisibleBoundaries(stageRect, stageScale);

  return (
    nodeRect.x + nodeRect.width >= visibleBoundaries.x &&
    nodeRect.y + nodeRect.height >= visibleBoundaries.y &&
    nodeRect.x <= visibleBoundaries.x + visibleBoundaries.width &&
    nodeRect.y <= visibleBoundaries.y + visibleBoundaries.height
  );
}

export function getCanvasCenteredPositionRelativeToNodes(
  nodes: NodeObject[],
  canvasConfig: { width?: number; height?: number; scale?: number },
) {
  const { minX, minY, maxX, maxY } = getNodesMinMaxPoints(nodes);

  const { width, height, scale } = {
    width: canvasConfig.width ?? window.innerWidth,
    height: canvasConfig.height ?? window.innerHeight,
    scale: canvasConfig.scale ?? 1,
  };

  return {
    x: -minX * scale + (width - (maxX - minX) * scale) / 2,
    y: -minY * scale + (height - (maxY - minY) * scale) / 2,
  };
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

export function getCanvasCenterPosition(rect: IRect, scale: number) {
  const { x, y, width, height } = rect;

  return {
    x: (-x + width / 2) / scale,
    y: (-y + height / 2) / scale,
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

export function calculateCenterPoint(width: number, height: number) {
  return { x: width / 2, y: height / 2 };
}

export function inRange(value: number, start: number, end: number) {
  return value > start && value < end;
}
