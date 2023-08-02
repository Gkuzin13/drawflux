import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import type { Vector2d } from 'konva/lib/types';
import { useCallback, useEffect, useRef } from 'react';
import { Circle, Group } from 'react-konva';
import { type Point } from 'shared';
import { getRatioFromValue } from '@/utils/math';
import { calculateClampedMidPoint } from './helpers/calc';
import { theme } from 'shared';
import { TRANSFORMER } from '@/constants/shape';

type ArrowTransformerProps = {
  start: Point;
  end: Point;
  bendPoint: Point;
  bendMovement: {
    min: Vector2d;
    max: Vector2d;
  };
  stageScale: number;
  onTranformStart: () => void;
  onTransform: (updatedPoints: Point[], bend?: number) => void;
  onTransformEnd: (updatedPoints: Point[], bend?: number) => void;
};

type AnchorProps = {
  x: number;
  y: number;
  scale: number;
  onDragStart: (e: KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  dragBoundFunc?: (position: Vector2d) => void;
};

const controlIndex = 2;

const Anchor = ({
  x,
  y,
  scale,
  onDragStart,
  onDragMove,
  onDragEnd,
}: AnchorProps) => {
  const handleMouseEnter = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      const circle = event.target as Konva.Circle;

      circle.strokeWidth(TRANSFORMER.ANCHOR_STROKE_WIDTH * 7);
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (event: KonvaEventObject<MouseEvent>) => {
      const circle = event.target as Konva.Circle;

      circle.strokeWidth(TRANSFORMER.ANCHOR_STROKE_WIDTH);
    },
    [],
  );

  return (
    <Circle
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
      stroke={theme.colors.green300.value}
      fill={theme.colors.white.value}
      fillAfterStrokeEnabled={true}
      draggable={true}
      strokeWidth={TRANSFORMER.ANCHOR_STROKE_WIDTH * 2.15}
      hitStrokeWidth={16}
      radius={3.75}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
    />
  );
};

const ArrowTransformer = ({
  start,
  end,
  bendPoint,
  bendMovement,
  stageScale,
  onTranformStart,
  onTransform,
  onTransformEnd,
}: ArrowTransformerProps) => {
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
    onTranformStart();

    if (!transformerRef.current) {
      return;
    }

    const transformer = transformerRef.current;
    transformer.visible(false);
  }, [transformerRef, onTranformStart]);

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
          <Anchor
            key={index}
            x={x}
            y={y}
            scale={1 / stageScale}
            onDragStart={handleDragStart}
            onDragMove={(event) => handleDragMove(event, index)}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </Group>
  );
};

export default ArrowTransformer;
