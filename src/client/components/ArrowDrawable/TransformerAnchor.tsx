import { CURSOR } from '@/client/shared/cursor';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';
import { useState } from 'react';
import { Circle } from 'react-konva';

export type TransformerAnchorProps = {
  active?: boolean;
  draggable: boolean;
  visible: boolean;
  x: number;
  y: number;
  name: string;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  dragBoundFunc?: (position: Vector2d) => void;
};

const TransformerAnchor = ({
  active = true,
  visible,
  draggable,
  name,
  x,
  y,
  onDragMove,
  onDragEnd,
  dragBoundFunc,
}: TransformerAnchorProps) => {
  const [hovering, setHovering] = useState(false);
  return (
    <Circle
      x={x}
      y={y}
      name={name}
      visible={visible}
      cursorType={CURSOR.POINTER}
      stroke="rgba(0, 81, 255, 0.4)"
      fillAfterStrokeEnabled={true}
      fill={active ? 'white' : 'rgba(0, 81, 255, 0.4)'}
      strokeWidth={hovering ? 12 : 1}
      hitStrokeWidth={16}
      radius={5}
      draggable={draggable}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      dragBoundFunc={dragBoundFunc as any}
    />
  );
};

export default TransformerAnchor;
