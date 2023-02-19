import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import ArrowTransformer from './ArrowTransformer/ArrowTransformer';
import ArrowHead from './ArrowTransformer/ArrowHead';
import ArrowLine from './ArrowTransformer/ArrowLine';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import { Group } from 'react-konva';
import { CURSOR } from '@/client/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { getLineValue, getSizeValue } from '../shared/element';
import type { NodeComponentProps } from './types';

const ArrowDrawable = ({
  nodeProps,
  type,
  style,
  selected,
  draggable,
  onContextMenu,
  onSelect,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState(nodeProps.points);

  const [start, end, control] = points;

  const strokeWidth = getSizeValue(style.size);
  const dash = getLineValue(style.line);

  const lineRef = useRef<Konva.Line>(null);

  const { animating } = useAnimatedLine(
    lineRef.current,
    dash[0] + dash[1],
    style.animated,
    style.line,
  );

  useEffect(() => {
    setPoints(nodeProps.points);
  }, [nodeProps.points]);

  return (
    <Group
      id={nodeProps.id}
      cursorType={CURSOR.ALL_SCROLL}
      onSelect={onSelect}
      draggable={draggable}
      onDragEnd={(event: KonvaEventObject<DragEvent>) => {
        onNodeChange({
          type,
          style,
          text: null,
          nodeProps: {
            ...nodeProps,
            points,
            x: event.target.x(),
            y: event.target.y(),
          },
        });
      }}
      onContextMenu={(e) => onContextMenu(e, nodeProps.id)}
      onClick={onSelect}
      onTap={onSelect}
    >
      <ArrowHead
        endPosition={end}
        headRotationPosition={control ?? start}
        color={style.color}
        strokeWidth={strokeWidth}
      />
      <ArrowLine
        ref={lineRef}
        start={start}
        end={end}
        control={control}
        color={style.color}
        strokeWidth={strokeWidth}
        dash={dash}
      />
      {selected && (
        <ArrowTransformer
          points={points}
          draggable={draggable}
          onAnchorMove={(points) => setPoints(points)}
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
