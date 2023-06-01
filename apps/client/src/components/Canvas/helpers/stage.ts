import type Konva from 'konva';
import type { IRect, Vector2d } from 'konva/lib/types';
import { Util } from 'konva/lib/Util';
import type { NodeObject } from 'shared';

const POINTER_RECT_SIZE = 16;

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
      return group.getChildren().some((c) => {
        return Util.haveIntersection(rect, c.getClientRect());
      });
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
  stage: Konva.Stage,
  nodes: NodeObject[],
  rect: IRect,
): (Konva.Shape | Konva.Group)[] {
  const layer = stage.getLayers()[0];

  const nodesIds = new Set(nodes.map((node) => node.nodeProps.id));
  const children = layer.getChildren((child) => nodesIds.has(child.id()));

  if (!children.length) return [];

  return getIntersectingNodes(children, rect);
}
