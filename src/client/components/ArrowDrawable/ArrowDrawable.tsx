import { useLayoutEffect, useRef, useState } from 'react';
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
import { getValueFromRatio } from '@/client/shared/utils/math';
import { calcMinMaxMovementPoints } from './helpers/calc';

const ArrowDrawable = ({
  node,
  selected,
  draggable,
  onPress,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState<Point[]>([
    node.nodeProps.point,
    ...(node.nodeProps?.points || [node.nodeProps.point]),
  ]);
  const [bendValue, setBendValue] = useState<number>(
    node.nodeProps.bend || 0.5,
  );

  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    setPoints([
      node.nodeProps.point,
      ...(node.nodeProps?.points || [node.nodeProps.point]),
    ]);
  }, [node.nodeProps.point, node.nodeProps.points]);

  const lineRef = useRef<Konva.Line>(null);

  const { dash, strokeWidth } = getStyleValues(node.style);

  const [start, end] = points;

  useAnimatedLine(
    lineRef.current,
    dash[0] + dash[1],
    node.style.animated,
    node.style.line,
  );

  const config = createDefaultNodeConfig({
    stroke: node.style.color,
    strokeWidth,
    visible: node.nodeProps.visible,
  });

  const { minPoint, maxPoint } = calcMinMaxMovementPoints(start, end);

  const control = {
    x: getValueFromRatio(bendValue, minPoint.x, maxPoint.x),
    y: getValueFromRatio(bendValue, minPoint.y, maxPoint.y),
  };

  return (
    <>
      <Group
        id={node.nodeProps.id}
        draggable={draggable}
        visible={node.nodeProps.visible}
        opacity={node.style.opacity}
        onDragStart={() => setDragging(true)}
        onDragEnd={(event) => {
          const group = event.target as Konva.Group & Konva.Shape;
          const stage = group.getStage() as Konva.Stage;

          const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
            points,
            group,
            stage,
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

          group.position({ x: 0, y: 0 });

          setDragging(false);
        }}
        onTap={onPress}
        onClick={onPress}
      >
        <ArrowHead control={[control.x, control.y]} end={end} config={config} />
        <ArrowLine
          ref={lineRef}
          points={[start, end]}
          control={[control.x, control.y]}
          dash={dash}
          config={config}
        />
      </Group>
      {selected && !dragging && (
        <ArrowTransformer
          points={[start, end]}
          control={[control.x, control.y]}
          bend={bendValue}
          draggable
          onTransform={(updatedPoints, bend) => {
            setPoints(updatedPoints);
            setBendValue(bend);
          }}
          onTransformEnd={(updatedPoints, bend) => {
            setPoints(updatedPoints);

            onNodeChange({
              ...node,
              nodeProps: {
                ...node.nodeProps,
                bend,
                point: updatedPoints[0],
                points: [updatedPoints[1]],
              },
            });
          }}
        />
      )}
    </>
  );
};

export default ArrowDrawable;
