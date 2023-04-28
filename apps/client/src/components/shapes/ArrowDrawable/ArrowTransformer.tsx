import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useMemo } from 'react';
import { type Point } from 'shared';
import { getRatioFromValue } from '@/utils/math';
import {
  calculateClampedMidPoint,
  calculateMinMaxMovementPoints,
} from './helpers/calc';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  start: Point;
  end: Point;
  control: Point;
  draggable: boolean;
  onTransform: (updatedPoints: Point[], bend?: number) => void;
  onTransformEnd: (updatedPoints: Point[], bend?: number) => void;
};

const controlIndex = 2;

const ArrowTransformer = ({
  start,
  end,
  control,
  draggable,
  onTransform,
  onTransformEnd,
}: Props) => {
  const { minPoint, maxPoint } = useMemo(() => {
    return calculateMinMaxMovementPoints(start, end);
  }, [start, end]);

  const getBendValue = useCallback(
    (dragPosition: Point) => {
      const bendX = getRatioFromValue(dragPosition[0], minPoint.x, maxPoint.x);
      const bendY = getRatioFromValue(dragPosition[1], minPoint.y, maxPoint.y);

      return +((bendX + bendY) / 2).toFixed(2);
    },
    [minPoint, maxPoint],
  );

  const handleDragMove = useCallback(
    (event: KonvaEventObject<DragEvent>, index: number) => {
      const node = event.target as Konva.Circle;
      const stage = node.getStage() as Konva.Stage;

      const { x, y } = node.getAbsolutePosition(stage);

      if (index === controlIndex) {
        const { x: clampedX, y: clampedY } = calculateClampedMidPoint(
          [x, y],
          start,
          end,
        );

        node.position({ x: clampedX, y: clampedY });

        const updatedBend = getBendValue([clampedX, clampedY]);

        onTransform([start, end], updatedBend);

        return;
      }

      const updatedPoints = [...[start, end]];

      updatedPoints[index] = [x, y];

      onTransform(updatedPoints);
    },
    [start, end, getBendValue, onTransform],
  );

  const handleDragEnd = () => {
    onTransformEnd([start, end]);
  };

  return (
    <>
      {[start, end, control].map(([x, y], index) => {
        return (
          <TransformerAnchor
            key={index}
            x={x}
            y={y}
            onDragMove={(event) => handleDragMove(event, index)}
            onDragEnd={handleDragEnd}
            draggable={draggable}
          />
        );
      })}
    </>
  );
};

export default ArrowTransformer;
