import type Konva from 'konva';
import { type KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Group, Line, Shape } from 'react-konva';
import type { Point, NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { calculateLengthFromPoints, getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import ArrowTransformer from './ArrowTransformer';
import { calculateMinMaxMovementPoints } from './helpers/calc';

const defaultBend = 0.5;

const ArrowDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'arrow'>) => {
  const [points, setPoints] = useState<Point[]>([
    node.nodeProps.point,
    ...(node.nodeProps?.points || [node.nodeProps.point]),
  ]);
  const [bendValue, setBendValue] = useState(
    node.nodeProps.bend ?? defaultBend,
  );

  const [dragging, setDragging] = useState(false);

  const { config } = useNode(node, stageScale);

  const lineRef = useRef<Konva.Line>(null);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef: lineRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const [start, end] = points;

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

  const handleDragStart = useCallback(() => {
    setDragging(true);
  }, []);

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

      lineRef.current?.dash(dash.map((d) => d * stageScale));
    },
    [bendValue, node.style.line, node.style.size, stageScale],
  );

  const handleTransformEnd = useCallback(() => {
    setPoints(points);

    onNodeChange({
      ...node,
      nodeProps: {
        ...node.nodeProps,
        bend: bendValue,
        point: points[0],
        points: [points[1]],
      },
    });

    if (node.style.animated && animation?.isRunning() === false) {
      animation.start();
    }
  }, [node, bendValue, points, animation, onNodeChange]);

  const shouldTransformerRender = useMemo(() => {
    return selected && !dragging && node.nodeProps.visible;
  }, [selected, dragging, node.nodeProps.visible]);

  const drawArrowHead = useCallback(
    (ctx: Konva.Context, shape: Konva.Shape) => {
      const [controlX, controlY] = control;

      const PI2 = Math.PI * 2;
      const dx = end[0] - controlX;
      const dy = end[1] - controlY;

      const radians = (Math.atan2(dy, dx) + PI2) % PI2;
      const length = 3 * config.strokeWidth;
      const width = 4 * config.strokeWidth;

      ctx.save();

      ctx.beginPath();
      ctx.rotate(radians);

      ctx.moveTo(0, 0);
      ctx.lineTo(-length, width / 2);

      ctx.moveTo(0, 0);
      ctx.lineTo(-length, -width / 2);

      ctx.restore();
      ctx.fillStrokeShape(shape);
    },
    [control, end, config.strokeWidth],
  );

  const drawArrowLine = useCallback(
    (ctx: Konva.Context, shape: Konva.Shape) => {
      const [controlX, controlY] = control;

      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);

      ctx.quadraticCurveTo(controlX, controlY, end[0], end[1]);

      ctx.fillStrokeShape(shape);
    },
    [end, control, start],
  );

  return (
    <>
      <Group
        id={node.nodeProps.id}
        visible={node.nodeProps.visible}
        opacity={node.style.opacity}
        draggable={config.draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Shape
          {...config}
          draggable={false}
          x={end[0]}
          y={end[1]}
          dash={[]}
          sceneFunc={drawArrowHead}
        />
        <Line
          ref={lineRef}
          {...config}
          draggable={false}
          points={flattenedPoints}
          sceneFunc={drawArrowLine}
        />
      </Group>
      {shouldTransformerRender && (
        <ArrowTransformer
          start={start}
          end={end}
          bendPoint={control}
          bendMovement={{ min: minPoint, max: maxPoint }}
          stageScale={stageScale}
          onTranformStart={handleTransformStart}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </>
  );
};

export default ArrowDrawable;
