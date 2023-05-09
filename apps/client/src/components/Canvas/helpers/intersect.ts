import type Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import { Util } from 'konva/lib/Util';

export function getIntersectingChildren(
  children: (Konva.Shape | Konva.Group)[],
  rect: IRect,
) {
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
