import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import ArrowTransformer from './ArrowTransformer';
import ArrowHead from './ArrowHead';
import ArrowLine from './ArrowLine';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import { Group } from 'react-konva';
import { CURSOR } from '@/client/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { getLineValue, getSizeValue, Point } from '../../shared/element';
import type { NodeComponentProps } from '../types';

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
  const initialPoints = [nodeProps.point, nodeProps.point];

  const [start, control, end] = [
    nodeProps.point,
    ...(nodeProps.points || initialPoints),
  ] as Point[];

  const strokeWidth = getSizeValue(style.size);
  const dash = getLineValue(style.line);

  const lineRef = useRef<Konva.Line>(null);

  useAnimatedLine(
    lineRef.current,
    dash[0] + dash[1],
    style.animated,
    style.line,
  );

  return (
    <Group
      id={nodeProps.id}
      cursorType={CURSOR.ALL_SCROLL}
      onSelect={onSelect}
      draggable={draggable}
      onDragEnd={(event) => {
        if (event.target.nodeType !== 'Group') return;

        const group = event.target as Konva.Group & Konva.Shape;

        const points: Point[] = group
          .getChildren((child) => child.attrs?.id?.includes('anchor'))
          .map((child) => [child.x(), child.y()]);

        onNodeChange({
          type,
          style,
          text: null,
          nodeProps: {
            ...nodeProps,
            point: points[0],
            points: [points[1], points[2]],
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
          points={[start, control, end]}
          draggable={draggable}
          onAnchorMove={(points) =>
            onNodeChange({
              type,
              style,
              text: null,
              nodeProps: {
                ...nodeProps,
                point: points[0],
                points: [points[1], points[2]],
              },
            })
          }
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
