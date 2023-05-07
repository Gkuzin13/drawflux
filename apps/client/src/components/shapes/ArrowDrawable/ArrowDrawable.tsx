import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Group } from 'react-konva';
import type { Point, NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Node/Node';
import useNode from '@/hooks/useNode/useNode';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvasSlice';
import { getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import ArrowHead from './ArrowHead';
import ArrowLine from './ArrowLine';
import ArrowTransformer from './ArrowTransformer';
import { calculateMinMaxMovementPoints } from './helpers/calc';

const defaultBend = 0.5;

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
      node.nodeProps.bend ?? defaultBend,
    );
    const [dragging, setDragging] = useState(false);

    const { stageConfig } = useAppSelector(selectCanvas);

    const { scaledLine, config } = useNode(node, stageConfig, {
      dash: undefined,
    });

    useLayoutEffect(() => {
      setPoints([
        node.nodeProps.point,
        ...(node.nodeProps?.points || [node.nodeProps.point]),
      ]);

      setBendValue(node.nodeProps.bend ?? defaultBend);
    }, [node.nodeProps.point, node.nodeProps.points, node.nodeProps.bend]);

    const [start, end] = points;

    const { minPoint, maxPoint } = useMemo(() => {
      return calculateMinMaxMovementPoints(start, end);
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
            bend: bend ?? bendValue,
            point: updatedPoints[0],
            points: [updatedPoints[1]],
          },
        });
      },
      [node, bendValue, onNodeChange],
    );

    const handleTransform = useCallback(
      (updatedPoints: Point[], bend: NodeProps['bend']) => {
        setPoints(updatedPoints);
        setBendValue(bend ?? bendValue);
      },
      [bendValue],
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
            points={[start, end]}
            control={[control.x, control.y]}
            dash={scaledLine}
            animated={node.style.animated}
            config={config}
          />
        </Group>
        {selected && !dragging && (
          <ArrowTransformer
            draggable={draggable}
            start={start}
            end={end}
            bendPoint={[control.x, control.y]}
            bendMovement={{ min: minPoint, max: maxPoint }}
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
