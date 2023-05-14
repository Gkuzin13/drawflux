import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import type { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { Group } from 'react-konva';
import { type Point } from 'shared';
import { getRatioFromValue } from '@/utils/math';
import { calculateClampedMidPoint } from './helpers/calc';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  start: Point;
  end: Point;
  bendPoint: Point;
  bendMovement: {
    min: Vector2d;
    max: Vector2d;
  };
  draggable: boolean;
  stageScale: number;
  onTransform: (updatedPoints: Point[], bend?: number) => void;
  onTransformEnd: (updatedPoints: Point[], bend?: number) => void;
};

const controlIndex = 2;

const ArrowTransformer = ({
  start,
  end,
  bendPoint,
  bendMovement,
  draggable,
  stageScale,
  onTransform,
  onTransformEnd,
}: Props) => {
  const transformerRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.moveToTop();
    }
  }, [transformerRef]);

  const getBendValue = useCallback(
    (dragPosition: Point) => {
      const bendX = getRatioFromValue(
        dragPosition[0],
        bendMovement.min.x,
        bendMovement.max.x,
      );
      const bendY = getRatioFromValue(
        dragPosition[1],
        bendMovement.min.y,
        bendMovement.max.y,
      );

      return +((bendX + bendY) / 2).toFixed(2);
    },
    [bendMovement],
  );

  const handleDragStart = useCallback(() => {
    if (!transformerRef.current) {
      return;
    }

    const transformer = transformerRef.current;
    transformer.visible(false);
  }, [transformerRef]);

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
    if (!transformerRef.current) {
      return;
    }

    onTransformEnd([start, end]);

    const transformer = transformerRef.current;
    transformer.visible(true);
  };

  return (
    <Group ref={transformerRef}>
      {[start, end, bendPoint].map(([x, y], index) => {
        return (
          <TransformerAnchor
            key={index}
            x={x}
            y={y}
            scale={1 / stageScale}
            onDragStart={handleDragStart}
            onDragMove={(event) => handleDragMove(event, index)}
            onDragEnd={handleDragEnd}
            draggable={draggable}
          />
        );
      })}
    </Group>
  );
};

export default ArrowTransformer;
