import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  points: [Point, Point, Point];
  visible: boolean;
  draggable: boolean;
  onTransform: (updatedPoints: Point[]) => void;
  onTransformEnd: (points: Point[]) => void;
};

const ANCHOR_INDEX = {
  START: 0,
  CONTROL: 1,
  END: 2,
} as const;

const ArrowTransformer = ({
  points,
  draggable,
  visible,
  onTransform,
  onTransformEnd,
}: Props) => {
  const [start, control, end] = points;

  const onAnchorDragMove = (
    event: KonvaEventObject<DragEvent>,
    index: number,
  ) => {
    const node = event.target as Konva.Circle;

    const updatedPoints = [...points];

    updatedPoints[index] = [node.x(), node.y()];

    onTransform(updatedPoints);
  };

  const onAnchorDragEnd = () => {
    onTransformEnd(points);
  };

  function getControlPointAfterDrag(
    newPos: Point,
    prevPos: Point,
    controlPoint: Point,
  ): Point {
    // Calculate the displacement of the dragged point from its original position
    const displacement = {
      x: newPos[0] - prevPos[0],
      y: newPos[1] - prevPos[1],
    };

    // If the dragged point is not the middle point, move the middle point with it
    return [controlPoint[0] + displacement.x, controlPoint[1] + displacement.y];
  }

  function clampAnchorPoint(
    position: Point,
    startPos: Point,
    endPos: Point,
  ): Point {
    const dx = endPos[0] - startPos[0];
    const dy = endPos[1] - startPos[1];

    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Calculate the midpoint between the two points
    const mid = {
      x: (startPos[0] + endPos[0]) / 2,
      y: (startPos[1] + endPos[1]) / 2,
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
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.START)}
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
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.CONTROL)}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
      />
      <TransformerAnchor
        key={`anchor-2`}
        name={`anchor-2`}
        x={end[0]}
        y={end[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.END)}
        onDragEnd={onAnchorDragEnd}
        draggable
        visible={visible}
      />
    </>
  );
};

export default ArrowTransformer;
