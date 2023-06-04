import type Konva from 'konva';
import type { IRect, Vector2d } from 'konva/lib/types';
import { Util } from 'konva/lib/Util';
import type { NodeObject } from 'shared';

const POINTER_RECT_SIZE = 32;

export function getIntersectingNodes(
  children: (Konva.Shape | Konva.Group)[],
  rect: IRect,
): (Konva.Shape | Konva.Group)[] {
  if (!children.length) {
    return [];
  }

  return children.filter((child) => {
    if (child.hasChildren()) {
      const group = child as Konva.Group;

      return !!getIntersectingNodes(group.getChildren(), rect).length;
    }
    return Util.haveIntersection(rect, child.getClientRect());
  });
}

export function getPointerRect(position: Vector2d, scale: number): IRect {
  const rectSize = POINTER_RECT_SIZE * scale;

  return {
    width: rectSize,
    height: rectSize,
    x: position.x,
    y: position.y,
  };
}

export function getNodesIntersectingWithRect(
  layer: Konva.Layer,
  nodes: NodeObject[],
  rect: IRect,
): (Konva.Shape | Konva.Group)[] {
  const nodesIds = new Set(nodes.map((node) => node.nodeProps.id));
  const children = layer.getChildren((child) => nodesIds.has(child.id()));

  return getIntersectingNodes(children, rect);
}
