import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Group, Line, Shape } from 'react-konva';
import type { Point, NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { useAppSelector } from '@/stores/hooks';
import { selectCanvas } from '@/stores/slices/canvas';
import { calculateLengthFromPoints, getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue } from '@/utils/shape';
import ArrowTransformer from './ArrowTransformer';
import { calculateMinMaxMovementPoints } from './helpers/calc';
import { drawArrowHead, drawLine } from './helpers/draw';

const defaultBend = 0.5;

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
  const [bendValue, setBendValue] = useState(
    node.nodeProps.bend ?? defaultBend,
  );
  const [dragging, setDragging] = useState(false);

  const [start, end] = points;

  const { stageConfig } = useAppSelector(selectCanvas);
  const { config } = useNode(node, stageConfig);

  const lineRef = useRef<Konva.Line>(null);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef: lineRef,
    totalDashLength: config.dash[0] + config.dash[1],
  });

  useLayoutEffect(() => {
    setPoints([
      node.nodeProps.point,
      ...(node.nodeProps?.points || [node.nodeProps.point]),
    ]);

    setBendValue(node.nodeProps.bend ?? defaultBend);
  }, [node.nodeProps.point, node.nodeProps.points, node.nodeProps.bend]);

  const { minPoint, maxPoint } = useMemo(() => {
    return calculateMinMaxMovementPoints(start, end);
  }, [start, end]);

  const control = useMemo((): Point => {
    return [
      getValueFromRatio(bendValue, minPoint.x, maxPoint.x),
      getValueFromRatio(bendValue, minPoint.y, maxPoint.y),
    ];
  }, [bendValue, minPoint, maxPoint]);

  const flattenedPoints = useMemo(() => points.flat(), [points]);

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

      if (!selected) {
        onPress(node.nodeProps.id);
      }
    },
    [node, points, selected, onNodeChange, onPress],
  );

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation?.isRunning()) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handleTransform = useCallback(
    (updatedPoints: Point[], bend: NodeProps['bend']) => {
      setPoints(updatedPoints);
      setBendValue(bend ?? bendValue);

      const lineLength = calculateLengthFromPoints(updatedPoints);
      const dash = getDashValue(
        lineLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      lineRef.current?.dash(dash.map((d) => d * stageConfig.scale));
    },
    [bendValue, node.style.line, node.style.size, stageConfig.scale],
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

      if (node.style.animated && animation?.isRunning() === false) {
        animation.start();
      }
    },
    [node, bendValue, animation, onNodeChange],
  );

  const shouldTransformerRender = useMemo(() => {
    return selected && !dragging && node.nodeProps.visible;
  }, [selected, dragging, node.nodeProps.visible]);

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
        <Shape
          {...config}
          x={end[0]}
          y={end[1]}
          dash={[]}
          sceneFunc={(ctx, shape) =>
            drawArrowHead(ctx, shape, control, end, config.strokeWidth)
          }
        />
        <Line
          ref={lineRef}
          {...config}
          points={flattenedPoints}
          sceneFunc={(ctx, shape) =>
            drawLine(ctx, shape, [start, end], control)
          }
        />
      </Group>
      {shouldTransformerRender && (
        <ArrowTransformer
          draggable={draggable}
          start={start}
          end={end}
          bendPoint={control}
          bendMovement={{ min: minPoint, max: maxPoint }}
          stageScale={stageConfig.scale}
          onTranformStart={handleTransformStart}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </>
  );
};

export default ArrowDrawable;
