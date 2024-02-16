import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import ArrowTransformer from './ArrowTransformer';
import { calculateLengthFromPoints, getValueFromRatio } from '@/utils/math';
import { getPointsAbsolutePosition } from '@/utils/position';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import {
  calculateMinMaxMovementPoints,
  getBendValue,
  getPoints,
} from './helpers';
import type Konva from 'konva';
import type { Point, NodeProps } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';
import { ARROW } from '@/constants/shape';
import NodeTransformer from '../../Transformer/NodeTransformer';
import useTransformer from '@/hooks/useTransformer';

const ArrowDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'arrow'>) => {
  const [points, setPoints] = useState(getPoints(node));
  const [bendValue, setBendValue] = useState(getBendValue(node));
  const [dragging, setDragging] = useState(false);

  const { transformerRef, nodeRef } = useTransformer<Konva.Line>([selected]);
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
    return selected && node.nodeProps.visible && !dragging;
  }, [selected, node.nodeProps.visible, dragging]);

  useEffect(() => {
    setPoints(getPoints(node));
    setBendValue(getBendValue(node));
  }, [node]);

  const handleDragStart = useCallback(() => setDragging(true), []);

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

      setDragging(false);

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

      if (bend) {
        setBendValue(bend);
      }

      const lineLength = calculateLengthFromPoints(updatedPoints);

      const dash = getDashValue(
        lineLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      lineRef.current?.dash(dash.map((d) => d * stageScale));
    },
    [node.style.line, node.style.size, stageScale],
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
    <>
      <Line
        ref={nodeRef}
        {...config}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dashEnabled={false}
        points={pointsWithControl.flat()}
        sceneFunc={(ctx, shape) => {
          // draw arrow line
          ctx.beginPath();
          ctx.setLineDash(config.dash);

          ctx.moveTo(start[0], start[1]);
          ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);

          ctx.fillStrokeShape(shape);

          // draw arrow head
          const dx = end[0] - control[0];
          const dy = end[1] - control[1];

          const PI2 = Math.PI * 2;
          const radians = (Math.atan2(dy, dx) + PI2) % PI2;
          const length = (ARROW.HEAD_LENGTH / stageScale) * config.strokeWidth;
          const width = (ARROW.HEAD_WIDTH / stageScale) * config.strokeWidth;

          ctx.beginPath();

          ctx.translate(end[0], end[1]);
          ctx.rotate(radians);

          ctx.moveTo(0, 0);
          ctx.lineTo(-length, width / 2);

          ctx.moveTo(0, 0);
          ctx.lineTo(-length, -width / 2);

          ctx.restore();

          ctx.fillStrokeShape(shape);
        }}
      />
      {selected && (
        <NodeTransformer
          ref={transformerRef}
          stageScale={stageScale}
          transformerConfig={{
            visible: false,
            enabledAnchors: [],
            resizeEnabled: false,
            rotateEnabled: false,
            flipEnabled: false,
            listening: false,
          }}
          transformerEvents={{
            onDragStart: undefined,
            onDragEnd: undefined,
          }}
        />
      )}
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
    </>
  );
};

export default ArrowDrawable;
