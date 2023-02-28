import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import ArrowTransformer from './ArrowTransformer';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import {
  createDefaultNodeConfig,
  getStyleValues,
  Point,
} from '../../shared/element';
import type { NodeComponentProps } from '../types';
import { Group } from 'react-konva';
import { getPointsAbsolutePosition } from '@/client/shared/utils/position';
import ArrowHead from './ArrowHead';
import ArrowLine from './ArrowLine';

const ArrowDrawable = ({
  node,
  selected,
  draggable,
  onSelect,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState<Point[]>([
    node.nodeProps.point,
    ...(node.nodeProps?.points || [node.nodeProps.point, node.nodeProps.point]),
  ]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setPoints([
      node.nodeProps.point,
      ...(node.nodeProps?.points || [
        node.nodeProps.point,
        node.nodeProps.point,
      ]),
    ]);
  }, [node.nodeProps.point, node.nodeProps.points]);

  const lineRef = useRef<Konva.Line>(null);

  const { dash, strokeWidth } = getStyleValues(node.style);
  const [start, control, end] = points;

  useAnimatedLine(
    lineRef.current,
    dash[0] + dash[1],
    node.style.animated,
    node.style.line,
  );

  const config = createDefaultNodeConfig({
    stroke: node.style.color,
    strokeWidth,
  });

  return (
    <>
      <Group
        id={node.nodeProps.id}
        draggable={draggable}
        visible={node.nodeProps.visible}
        opacity={node.style.opacity}
        onDragStart={() => setDragging(true)}
        onDragEnd={(event) => {
          const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
            points,
            event.target,
          );

          setPoints([firstPoint, ...restPoints]);

          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: firstPoint,
              points: restPoints,
            },
          });

          event.target.position({ x: 0, y: 0 });

          setDragging(false);
        }}
        onTap={onSelect}
        onClick={onSelect}
      >
        <ArrowHead control={control} end={end} config={config} />
        <ArrowLine ref={lineRef} points={points} dash={dash} config={config} />
      </Group>
      <ArrowTransformer
        points={[start, control, end]}
        draggable
        visible={selected && !dragging}
        onTransform={(points) => setPoints(points)}
        onTransformEnd={(points) => {
          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: points[0],
              points: [points[1], points[2]],
            },
          });
        }}
      />
    </>
  );
};

export default ArrowDrawable;
