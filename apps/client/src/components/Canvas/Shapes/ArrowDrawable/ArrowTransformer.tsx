import { useCallback, useEffect, useRef } from 'react';
import { Circle, Group } from 'react-konva';
import { getRatioFromValue } from '@/utils/math';
import { calculateClampedMidPoint } from './helpers/calc';
import { ARROW_TRANSFORMER } from '@/constants/shape';
import useDefaultThemeColors from '@/hooks/useThemeColors';
import { hexToRGBa } from '@/utils/string';
import type { Point } from 'shared';
import type Konva from 'konva';

type BendMovement = {
  min: Konva.Vector2d;
  max: Konva.Vector2d;
};

type ArrowTransformerProps = {
  start: Point;
  end: Point;
  bendPoint: Point;
  bendMovement: BendMovement;
  stageScale: number;
  onTranformStart: () => void;
  onTransform: (updatedPoints: Point[], bend?: number) => void;
  onTransformEnd: () => void;
};

type AnchorProps = {
  x: number;
  y: number;
  scale: number;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  dragBoundFunc?: (position: Konva.Vector2d) => void;
};

const getBendValue = (dragPosition: Point, bendMovement: BendMovement) => {
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
  const themeColors = useDefaultThemeColors();

  const handleMouseEnter = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;

      const circle = event.target as Konva.Circle;

      circle.strokeWidth(ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH_HOVER);
      circle.stroke(hexToRGBa(ARROW_TRANSFORMER.STROKE, 0.75));
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;

      const circle = event.target as Konva.Circle;

      circle.strokeWidth(ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH);
      circle.stroke(ARROW_TRANSFORMER.STROKE);
    },
    [],
  );

  return (
    <Circle
      x={x}
      y={y}
      scaleX={scale}
      scaleY={scale}
      stroke={ARROW_TRANSFORMER.STROKE}
      fill={themeColors['canvas-bg'].value}
      strokeWidth={ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH}
      hitStrokeWidth={ARROW_TRANSFORMER.HIT_STROKE_WIDTH}
      radius={ARROW_TRANSFORMER.RADIUS}
      fillAfterStrokeEnabled={true}
      draggable={true}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

  const normalizedScale = 1 / stageScale;

  useEffect(() => {
    if (transformerRef.current) {
      transformerRef.current.moveToTop();
    }
  }, []);

  const handleAnchorDragStart = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      event.cancelBubble = true;

      onTranformStart();
    },
    [onTranformStart],
  );

  const handleAnchorDragMove = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      event.cancelBubble = true;

      const node = event.target as Konva.Circle;
      const stage = node.getStage() as Konva.Stage;

      const { x, y } = node.getAbsolutePosition(stage);

      if (node.index === controlIndex) {
        const { x: clampedX, y: clampedY } = calculateClampedMidPoint(
          [x, y],
          start,
          end,
        );

        node.position({ x: clampedX, y: clampedY });

        const updatedBend = getBendValue([clampedX, clampedY], bendMovement);

        onTransform([start, end], updatedBend);

        return;
      }

      const updatedPoints = [...[start, end]];

      updatedPoints[node.index] = [x, y];

      onTransform(updatedPoints);
    },
    [start, end, bendMovement, onTransform],
  );

  const handleAnchorDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      event.cancelBubble = true;

      onTransformEnd();
    },
    [onTransformEnd],
  );

  return (
    <Group ref={transformerRef}>
      {[start, end, bendPoint].map(([x, y], index) => {
        return (
          <Anchor
            key={index}
            x={x}
            y={y}
            scale={normalizedScale}
            onDragStart={handleAnchorDragStart}
            onDragMove={handleAnchorDragMove}
            onDragEnd={handleAnchorDragEnd}
          />
        );
      })}
    </Group>
  );
};

export default ArrowTransformer;
