import { Point } from '@/client/shared/element';
import {
  getRatioFromValue,
  getValueFromRatio,
} from '@/client/shared/utils/math';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  points: [Point, Point];
  bend: number;
  control: Point;
  draggable: boolean;
  onTransform: (updatedPoints: Point[], bend: number) => void;
  onTransformEnd: (updatedPoints: Point[], bend: number) => void;
};

const ANCHOR_INDEX = {
  START: 0,
  END: 1,
  CONTROL: 2,
} as const;

const ArrowTransformer = ({
  points,
  control,
  bend,
  draggable,
  onTransform,
  onTransformEnd,
}: Props) => {
  const [start, end] = points;

  const { minPoint, maxPoint } = calculateMinMaxMovementPoints(start, end);

  const onAnchorDragMove = (
    event: KonvaEventObject<DragEvent>,
    index: number,
  ) => {
    const node = event.target as Konva.Circle;
    const stage = node.getStage() as Konva.Stage;

    const updatedPoints = [start, end];

    const { x, y } = node.getAbsolutePosition(stage);

    if (index === ANCHOR_INDEX.CONTROL) {
      const bendX = getRatioFromValue(x, minPoint.x, maxPoint.x);
      const bendY = getRatioFromValue(y, minPoint.y, maxPoint.y);

      const updatedBend = +((bendX + bendY) / 2).toFixed(2);

      onTransform(updatedPoints, updatedBend);
      return;
    }

    updatedPoints[index] = [x, y];

    onTransform(updatedPoints, bend);
  };

  const onAnchorDragEnd = () => {
    onTransformEnd(points, bend);
  };

  function calculateMinMaxMovementPoints(startPos: Point, endPos: Point) {
    const dx = endPos[0] - startPos[0];
    const dy = endPos[1] - startPos[1];

    const length = Math.sqrt(dx ** 2 + dy ** 2);

    const mid = {
      x: (startPos[0] + endPos[0]) / 2,
      y: (startPos[1] + endPos[1]) / 2,
    };

    const perp = {
      x: dy / length,
      y: -dx / length,
    };

    const maxDist = length / 2;

    const minPoint = {
      x: mid.x - perp.x * maxDist,
      y: mid.y - perp.y * maxDist,
    };

    const maxPoint = {
      x: mid.x + perp.x * maxDist,
      y: mid.y + perp.y * maxDist,
    };

    return { minPoint, maxPoint };
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
        key={0}
        x={start[0]}
        y={start[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.START)}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
      />

      <TransformerAnchor
        key={1}
        x={end[0]}
        y={end[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.END)}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
      />
      <TransformerAnchor
        key={2}
        x={control[0]}
        y={control[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.CONTROL)}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
        dragBoundFunc={(position) => {
          const [x, y] = clampAnchorPoint([position.x, position.y], start, end);

          return { x, y };
        }}
      />
    </>
  );
};

export default ArrowTransformer;
