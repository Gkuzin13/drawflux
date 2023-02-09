import { CURSOR_STYLES } from '@/shared/constants/base';
import { KonvaEventObject } from 'konva/lib/Node';
import { Circle } from 'react-konva';

type Props = {
  id: string;
  x: number;
  y: number;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
};

const TransformerAnchor = ({ id, x, y, onDragMove }: Props) => {
  return (
    <Circle
      x={x}
      y={y}
      id={id}
      cursorType={CURSOR_STYLES.POINTER}
      stroke="gray"
      fill="white"
      hitStrokeWidth={12}
      radius={6}
      draggable={true}
      onDragMove={onDragMove}
    />
  );
};

export default TransformerAnchor;
