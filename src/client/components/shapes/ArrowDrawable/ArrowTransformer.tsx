import { Point } from '@/client/shared/constants/element';
import { getRatioFromValue } from '@/client/shared/utils/math';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
import { calcMidPointAndPerp, calcMinMaxMovementPoints } from './helpers/calc';
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

  const { minPoint, maxPoint } = useMemo(() => {
    return calcMinMaxMovementPoints(start, end);
  }, [start, end]);

  const onAnchorDragMove = useCallback(
    (event: KonvaEventObject<DragEvent>, index: number) => {
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
    },
    [start, end, bend, onTransform],
  );

  const onAnchorDragEnd = () => {
    onTransformEnd(points, bend);
  };

  const handleDragMove = useCallback(
    (event: KonvaEventObject<DragEvent>) => {
      const anchor = event.target as Konva.Circle;
      const stage = anchor.getStage() as Konva.Stage;
      const position = anchor.getAbsolutePosition(stage);

      function clampAnchorPoint(
        position: Point,
        startPos: Point,
        endPos: Point,
      ) {
        const { mid, perp, length } = calcMidPointAndPerp(startPos, endPos);

        // Calculate the distance of the drag from the midpoint along the perpendicular vector
        let dragDist =
          (position[0] - mid.x) * perp.x + (position[1] - mid.y) * perp.y;

        dragDist = Math.max(Math.min(dragDist, length / 2), -length / 2);

        return {
          x: mid.x + dragDist * perp.x,
          y: mid.y + dragDist * perp.y,
        };
      }

      const { x, y } = clampAnchorPoint([position.x, position.y], start, end);

      anchor.position({ x, y });

      onAnchorDragMove(event, ANCHOR_INDEX.CONTROL);
    },
    [start, end, onAnchorDragMove],
  );

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
        onDragMove={handleDragMove}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
      />
    </>
  );
};

export default ArrowTransformer;
