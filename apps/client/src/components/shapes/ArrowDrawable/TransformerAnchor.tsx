import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { type Vector2d } from 'konva/lib/types';
import { useCallback } from 'react';
import { Circle } from 'react-konva';
import { theme } from 'shared';
import { TRANSFORMER } from '@/constants/element';

export type TransformerAnchorProps = {
  draggable: boolean;
  x: number;
  y: number;
  scale: number;
  onDragStart: (e: KonvaEventObject<DragEvent>) => void;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  dragBoundFunc?: (position: Vector2d) => void;
};

const TransformerAnchor = ({
  draggable,
  x,
  y,
  scale,
  onDragStart,
  onDragMove,
  onDragEnd,
}: TransformerAnchorProps) => {
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
      strokeWidth={TRANSFORMER.ANCHOR_STROKE_WIDTH * 2.15}
      hitStrokeWidth={16}
      radius={3.75}
      draggable={draggable}
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

export default TransformerAnchor;
