import { CURSOR_STYLES } from '@/shared/constants/base';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { Circle } from 'react-konva';

type Props = {
  active?: boolean;
  id: string;
  x: number;
  y: number;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
};

const TransformerAnchor = ({ active = true, id, x, y, onDragMove }: Props) => {
  const [hovering, setHovering] = useState(false);

  return (
    <Circle
      x={x}
      y={y}
      id={id}
      cursorType={CURSOR_STYLES.POINTER}
      stroke="rgba(0, 81, 255, 0.4)"
      fillAfterStrokeEnabled={true}
      fill={active ? 'white' : 'rgba(0, 81, 255, 0.4)'}
      strokeWidth={hovering ? 12 : 1}
      hitStrokeWidth={16}
      radius={5}
      shadowEnabled={hovering}
      shadowColor={'black'}
      shadowForStrokeEnabled={true}
      draggable={true}
      onDragMove={onDragMove}
      onMouseOver={(e) => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    />
  );
};

export default TransformerAnchor;
