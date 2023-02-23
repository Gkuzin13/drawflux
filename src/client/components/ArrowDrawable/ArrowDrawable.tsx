import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import ArrowTransformer from './ArrowTransformer';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import { getLineValue, getSizeValue, Point } from '../../shared/element';
import type { NodeComponentProps } from '../types';
import ArrowHead from './ArrowHead';
import ArrowLine from './ArrowLine';
import { Group, Line } from 'react-konva';
import { IRect } from 'konva/lib/types';

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
  const [points, setPoints] = useState<Point[]>([
    nodeProps.point,
    ...(nodeProps?.points || [nodeProps.point, nodeProps.point]),
  ]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setPoints([
      nodeProps.point,
      ...(nodeProps?.points || [nodeProps.point, nodeProps.point]),
    ]);
  }, [nodeProps.point, nodeProps.points]);

  const [start, control, end] = points;

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
      onTap={onSelect}
      onClick={onSelect}
      draggable={draggable}
      visible={nodeProps.visible}
      onDragStart={(event) => {
        if (event.target.nodeType !== 'Group') {
          return;
        }
        onSelect();
        setDragging(true);
      }}
      onDragEnd={(event) => {
        const group = event.target as Konva.Group & Konva.Shape;

        if (!group.hasChildren()) return;

        const anchors = group.getChildren(
          (child) => child.className === 'Circle',
        );

        const updatedPoints: Point[] = anchors.map((anchor) => {
          return [anchor.x(), anchor.y()];
        });

        onNodeChange({
          type,
          style,
          text: null,
          nodeProps: {
            ...nodeProps,
            point: updatedPoints[0],
            points: [updatedPoints[1], updatedPoints[2]],
          },
        });

        setDragging(false);
      }}
    >
      <ArrowHead
        strokeWidth={strokeWidth}
        color={style.color}
        end={end}
        control={control}
      />
      <ArrowLine
        ref={lineRef}
        points={points}
        color={style.color}
        dash={dash}
        strokeWidth={strokeWidth}
      />
      {selected && (
        <ArrowTransformer
          points={[start, control, end]}
          draggable
          visible={!dragging}
          onTransform={(points) => setPoints(points)}
          onTransformEnd={(points) => {
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
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
