import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  points: [Point, Point, Point];
  visible: boolean;
  draggable: boolean;
  onTransform: (updatedPoints: Point[]) => void;
  onTransformEnd: (updatedPoints: Point[]) => void;
};

const ArrowTransformer = ({
  points,
  draggable,
  visible,
  onTransform,
  onTransformEnd,
}: Props) => {
  const [start, control, end] = points;

  const onAnchorDragMove = (event: KonvaEventObject<DragEvent>) => {
    if (!event.target) return;

    const node = event.target as Konva.Circle;
    const draggedIndex = +node.name().split('-')[1];

    const updatedPoints = [...points];

    updatedPoints[draggedIndex] = [node.x(), node.y()];

    if (draggedIndex !== 1) {
      updatedPoints[1] = clampAnchorPoint(
        getControlPointAfterDrag(
          updatedPoints[draggedIndex],
          points[draggedIndex],
          control,
        ),
      );
    }
    onTransform(updatedPoints);
  };

  const onAnchorDragEnd = () => {
    onTransformEnd(points);
  };

  function getControlPointAfterDrag(
    prevPoint: Point,
    draggedPoint: Point,
    controlPoint: Point,
  ): Point {
    // Calculate the displacement of the dragged point from its original position
    const displacement = {
      x: prevPoint[0] - draggedPoint[0],
      y: prevPoint[1] - draggedPoint[1],
    };

    // If the dragged point is not the middle point, move the middle point with it
    return [controlPoint[0] + displacement.x, controlPoint[1] + displacement.y];
  }

  function clampAnchorPoint(position: Point): Point {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Calculate the midpoint between the two points
    const mid = {
      x: (start[0] + end[0]) / 2,
      y: (start[1] + end[1]) / 2,
    };

    // Calculate a perpendicular vector to the line connecting the two points
    const perp = {
      x: dy / length,
      y: -dx / length,
    };

    // Calculate the distance of the drag from the midpoint along the perpendicular vector
    let dragDist =
      (position[0] - mid.x) * perp.x + (position[1] - mid.y) * perp.y;
    dragDist = Math.max(Math.min(dragDist, length / 2), -length / 2);

    return [mid.x + perp.x * dragDist, mid.y + perp.y * dragDist];
  }

  return (
    <>
      <TransformerAnchor
        key={`anchor-0`}
        name={`anchor-0`}
        x={start[0]}
        y={start[1]}
        onDragMove={onAnchorDragMove}
        onDragEnd={onAnchorDragEnd}
        draggable
        visible={visible}
      />
      <TransformerAnchor
        key={`anchor-1`}
        name={`anchor-1`}
        active={true}
        x={control[0]}
        y={control[1]}
        visible={visible}
        onDragMove={onAnchorDragMove}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
        dragBoundFunc={({ x, y }) => {
          const newPos = clampAnchorPoint([x, y]);

          return { x: newPos[0], y: newPos[1] };
        }}
      />
      <TransformerAnchor
        key={`anchor-2`}
        name={`anchor-2`}
        x={end[0]}
        y={end[1]}
        onDragMove={onAnchorDragMove}
        onDragEnd={onAnchorDragEnd}
        draggable
        visible={visible}
      />
    </>
  );
};

export default ArrowTransformer;
