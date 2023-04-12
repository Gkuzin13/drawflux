import { theme } from '@shared';
import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { type Vector2d } from 'konva/lib/types';
import { useCallback, useRef, useState } from 'react';
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

  const ref = useRef<Konva.Circle>(null);

  const scale = useCallback(() => {
    const stage = ref.current?.getStage();

    if (stage) {
      return {
        x: 1 / stage.scaleX(),
        y: 1 / stage.scaleY(),
      };
    }

    return { x: 1, y: 1 };
  }, []);

  return (
    <Circle
      ref={ref}
      x={x}
      y={y}
      scale={scale()}
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
