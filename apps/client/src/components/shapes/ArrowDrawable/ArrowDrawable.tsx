import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Group } from 'react-konva';
import { type Point, type NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Node/Node';
import { createDefaultNodeConfig } from '@/constants/element';
import useAnimatedLine from '@/hooks/useAnimatedLine';
import { getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import ArrowHead from './ArrowHead';
import ArrowLine from './ArrowLine';
import ArrowTransformer from './ArrowTransformer';
import { DEFAULT_BEND } from './constants';
import { calcMinMaxMovementPoints } from './helpers/calc';

const ArrowDrawable = memo(
  ({
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
      node.nodeProps.bend ?? DEFAULT_BEND,
    );
    const [dragging, setDragging] = useState(false);

    useLayoutEffect(() => {
      setPoints([
        node.nodeProps.point,
        ...(node.nodeProps?.points || [node.nodeProps.point]),
      ]);

      setBendValue(node.nodeProps.bend ?? DEFAULT_BEND);
    }, [node.nodeProps.point, node.nodeProps.points, node.nodeProps.bend]);

    const lineRef = useRef<Konva.Line>(null);

    useAnimatedLine(
      lineRef.current,
      node.style.line[0] + node.style.line[1],
      node.style.animated,
      node.style.line,
    );

    const [start, end] = points;

    const config = useMemo(() => {
      return createDefaultNodeConfig({
        stroke: node.style.color,
        strokeWidth: node.style.size,
        visible: node.nodeProps.visible,
      });
    }, [node.style.color, node.style.size, node.nodeProps.visible]);

    const { minPoint, maxPoint } = useMemo(() => {
      return calcMinMaxMovementPoints(start, end);
    }, [start, end]);

    const control = useMemo(() => {
      return {
        x: getValueFromRatio(bendValue, minPoint.x, maxPoint.x),
        y: getValueFromRatio(bendValue, minPoint.y, maxPoint.y),
      };
    }, [bendValue, minPoint, maxPoint]);

    const handleDragEnd = useCallback(
      (event: KonvaEventObject<DragEvent>) => {
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
      },
      [node, points, onNodeChange],
    );

    const handleTransformEnd = useCallback(
      (updatedPoints: Point[], bend: NodeProps['bend']) => {
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
      },
      [node, onNodeChange],
    );

    const handleTransform = useCallback(
      (updatedPoints: Point[], bend: NodeProps['bend']) => {
        setPoints(updatedPoints);
        setBendValue(bend ?? DEFAULT_BEND);
      },
      [],
    );

    return (
      <>
        <Group
          id={node.nodeProps.id}
          draggable={draggable}
          visible={node.nodeProps.visible}
          opacity={node.style.opacity}
          onDragStart={() => setDragging(true)}
          onDragEnd={handleDragEnd}
          onTap={() => onPress(node.nodeProps.id)}
          onClick={() => onPress(node.nodeProps.id)}
        >
          <ArrowHead
            control={[control.x, control.y]}
            end={end}
            config={config}
          />
          <ArrowLine
            ref={lineRef}
            points={[start, end]}
            control={[control.x, control.y]}
            dash={node.style.line}
            config={config}
          />
        </Group>
        {selected && !dragging && (
          <ArrowTransformer
            draggable
            points={[start, end]}
            control={[control.x, control.y]}
            bend={bendValue}
            onTransform={handleTransform}
            onTransformEnd={handleTransformEnd}
          />
        )}
      </>
    );
  },
);

ArrowDrawable.displayName = 'ArrowDrawable';

export default ArrowDrawable;
