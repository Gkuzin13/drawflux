import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Line, Shape } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import { calculateLengthFromPoints, getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import ArrowTransformer from './ArrowTransformer';
import { calculateMinMaxMovementPoints } from './helpers/calc';
import { drawArrowHead, drawArrowLine } from './helpers/draw';
import type Konva from 'konva';
import type { Point, NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const defaultBend = 0.5;

const ArrowDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'arrow'>) => {
  const [points, setPoints] = useState([
    node.nodeProps.point,
    ...(node.nodeProps?.points || [node.nodeProps.point]),
  ]);
  const [bendValue, setBendValue] = useState(
    node.nodeProps.bend ?? defaultBend,
  );

  const { config } = useNode(node, stageScale);

  const lineRef = useRef<Konva.Line>(null);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef: lineRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const [start, end] = points;

  const bendMovement = useMemo(() => {
    return calculateMinMaxMovementPoints(start, end);
  }, [start, end]);

  const control = useMemo((): Point => {
    const { min, max } = bendMovement;

    return [
      getValueFromRatio(bendValue, min.x, max.x),
      getValueFromRatio(bendValue, min.y, max.y),
    ];
  }, [bendValue, bendMovement]);

  const pointsWithControl = [start, control, end];

  const shouldTransformerRender = useMemo(() => {
    return selected && node.nodeProps.visible;
  }, [selected, node.nodeProps.visible]);

  useEffect(() => {
    setPoints([
      node.nodeProps.point,
      ...(node.nodeProps?.points || [node.nodeProps.point]),
    ]);
    setBendValue(node.nodeProps.bend ?? defaultBend);
  }, [node.nodeProps.point, node.nodeProps.points, node.nodeProps.bend]);

  const handleDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
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
    },
    [node, points, onNodeChange],
  );

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation?.isRunning()) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handleTransform = useCallback(
    (updatedPoints: Point[], bend?: NodeProps['bend']) => {
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

  return (
    <Group
      id={node.nodeProps.id}
      visible={node.nodeProps.visible}
      opacity={node.style.opacity}
      draggable={config.draggable}
      onDragEnd={handleDragEnd}
    >
      <Shape
        {...config}
        draggable={false}
        points={pointsWithControl}
        dash={undefined}
        sceneFunc={drawArrowHead}
      />
      <Line
        ref={lineRef}
        {...config}
        draggable={false}
        points={pointsWithControl.flat()}
        sceneFunc={drawArrowLine}
      />
      {shouldTransformerRender && (
        <ArrowTransformer
          start={start}
          end={end}
          bendPoint={control}
          bendMovement={bendMovement}
          stageScale={stageScale}
          onTranformStart={handleTransformStart}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
