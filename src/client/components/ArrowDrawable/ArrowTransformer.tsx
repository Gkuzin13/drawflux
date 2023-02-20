import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  points: Point[];
  draggable: boolean;
  onAnchorMove: (updatedPoints: Point[]) => void;
};

const ArrowTransformer = ({ points, draggable, onAnchorMove }: Props) => {
  const [start, end, control] = points;

  const onAnchorDragMove = (event: KonvaEventObject<DragEvent>) => {
    if (!event.target) return;

    const node = event.target as Konva.Circle;
    const draggedIndex = node.attrs.id.split('-')[1];

    const updatedPoints = [...points];

    updatedPoints[draggedIndex] = { x: node.x(), y: node.y() };

    if (draggedIndex !== '2' && control) {
      updatedPoints[2] = clampAnchorPoint(
        getControlPointAfterDrag(
          updatedPoints[draggedIndex],
          points[draggedIndex],
          control,
        ),
      );
    }

    onAnchorMove(updatedPoints);
  };

  function getControlPointAfterDrag(
    prevPoint: Point,
    draggedPoint: Point,
    controlPoint: Point,
  ) {
    // Calculate the displacement of the dragged point from its original position
    const displacement = {
      x: prevPoint.x - draggedPoint.x,
      y: prevPoint.y - draggedPoint.y,
    };

    // If the dragged point is not the middle point, move the middle point with it
    return {
      x: controlPoint.x + displacement.x,
      y: controlPoint.y + displacement.y,
    };
  }

  function clampAnchorPoint(position: Point) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Calculate the midpoint between the two points
    const mid = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };

    // Calculate a perpendicular vector to the line connecting the two points
    const perp = {
      x: dy / length,
      y: -dx / length,
    };

    // Calculate the distance of the drag from the midpoint along the perpendicular vector
    let dragDist =
      (position.x - mid.x) * perp.x + (position.y - mid.y) * perp.y;
    dragDist = Math.max(Math.min(dragDist, length / 2), -length / 2);

    return {
      x: mid.x + perp.x * dragDist,
      y: mid.y + perp.y * dragDist,
    };
  }

  function getDefaultControlPosition(start: number, end: number) {
    return (start + end) / 2;
  }

  return (
    <>
      <TransformerAnchor
        key={`anchor-0`}
        id={`anchor-0`}
        x={start.x}
        y={start.y}
        onDragMove={onAnchorDragMove}
        draggable={draggable}
      />
      <TransformerAnchor
        key={`anchor-1`}
        id={`anchor-1`}
        x={end.x}
        y={end.y}
        onDragMove={onAnchorDragMove}
        draggable={draggable}
      />
      <TransformerAnchor
        key={`anchor-2`}
        id={`anchor-2`}
        active={control ? true : false}
        x={control ? control.x : getDefaultControlPosition(start.x, end.x)}
        y={control ? control.y : getDefaultControlPosition(start.y, end.y)}
        onDragMove={onAnchorDragMove}
        draggable={draggable}
        dragBoundFunc={clampAnchorPoint}
      />
    </>
  );
};

export default ArrowTransformer;
