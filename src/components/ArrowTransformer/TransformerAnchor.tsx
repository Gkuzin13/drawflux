import { CURSOR } from '@/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Circle } from 'react-konva';

type Props = {
  active?: boolean;
  draggable: boolean;
  id: string;
  x: number;
  y: number;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
};

const TransformerAnchor = ({
  active = true,
  draggable,
  id,
  x,
  y,
  onDragMove,
}: Props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <Circle
      x={x}
      y={y}
      id={id}
      cursorType={CURSOR.POINTER}
      stroke="rgba(0, 81, 255, 0.4)"
      fillAfterStrokeEnabled={true}
      fill={active ? 'white' : 'rgba(0, 81, 255, 0.4)'}
      strokeWidth={hovering ? 12 : 1}
      hitStrokeWidth={16}
      radius={5}
      draggable={draggable}
      onDragMove={onDragMove}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    />
  );
};

export default TransformerAnchor;
