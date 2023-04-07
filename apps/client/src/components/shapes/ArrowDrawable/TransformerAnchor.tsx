import { theme } from '@shared';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useState } from 'react';
import { Circle } from 'react-konva';

export type TransformerAnchorProps = {
  draggable: boolean;
  x: number;
  y: number;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  dragBoundFunc?: (position: Vector2d) => void;
};

const TransformerAnchor = ({
  draggable,
  x,
  y,
  onDragMove,
  onDragEnd,
}: TransformerAnchorProps) => {
  const [hovering, setHovering] = useState(false);
  return (
    <Circle
      x={x}
      y={y}
      stroke={theme.colors.green300.value}
      fill={theme.colors.white.value}
      fillAfterStrokeEnabled={true}
      strokeWidth={hovering ? 12 : 3}
      hitStrokeWidth={16}
      radius={4}
      draggable={draggable}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
    />
  );
};

export default TransformerAnchor;
