import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-konva';
import useAnimatedDash from '@/hooks/useAnimatedDash/useAnimatedDash';
import useNode from '@/hooks/useNode/useNode';
import ArrowTransformer, { type OnTransformFnParams } from './ArrowTransformer';
import { calculateLengthFromPoints, getValueFromRatio } from '@/utils/math';
import { getDashValue, getSizeValue, getTotalDashLength } from '@/utils/shape';
import {
  calculateMinMaxMovementPoints,
  getBendValue,
  getDefaultBend,
  getDefaultPoints,
} from './helpers';
import { drawArrowHead } from './heads';
import type Konva from 'konva';
import type { Point } from 'shared';
import type { NodeComponentProps } from '@/components/Canvas/Node/Node';

const ArrowDrawable = ({
  node,
  selected,
  stageScale,
  onNodeChange,
}: NodeComponentProps<'arrow'>) => {
  const [points, setPoints] = useState(getDefaultPoints(node));
  const [bendValue, setBendValue] = useState(getDefaultBend(node));
  const [dragging, setDragging] = useState(false);

  const { config } = useNode(node, stageScale);

  const lineRef = useRef<Konva.Line>(null);

  const { animation } = useAnimatedDash({
    enabled: node.style.animated,
    nodeRef: lineRef,
    totalDashLength: getTotalDashLength(config.dash),
  });

  const arrowStartHead = node.style.arrowStartHead ?? 'arrow';
  const arrowEndHead = node.style.arrowEndHead;

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

  const flattenedPoints = useMemo(() => {
    return [start, control, end].flat();
  }, [start, control, end]);

  const shouldTransformerRender = useMemo(() => {
    return selected && node.nodeProps.visible && !dragging;
  }, [selected, node.nodeProps.visible, dragging]);

  useEffect(() => {
    setPoints(getDefaultPoints(node));
    setBendValue(getDefaultBend(node));
  }, [node]);

  const handleDragStart = useCallback(() => setDragging(true), []);
  const handleDragEnd = useCallback(() => setDragging(false), []);

  const handleTransformStart = useCallback(() => {
    if (node.style.animated && animation?.isRunning()) {
      animation.stop();
    }
  }, [node.style.animated, animation]);

  const handleTransform = useCallback(
    (event: OnTransformFnParams) => {
      if (event.anchorType === 'control') {
        const bend = getBendValue(event.point, bendMovement);
        setBendValue(bend);
      } else if (event.anchorType === 'start') {
        setPoints((prevPoints) => [event.point, prevPoints[1]]);
      } else {
        setPoints((prevPoints) => [prevPoints[0], event.point]);
      }

      const lineLength = calculateLengthFromPoints(points);

      const dash = getDashValue(
        lineLength,
        getSizeValue(node.style.size),
        node.style.line,
      );

      lineRef.current?.dash(dash.map((d) => d * stageScale));
    },
    [points, bendMovement, stageScale, node.style.size, node.style.line],
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
  }, [node, animation, bendValue, points, onNodeChange]);

  return (
    <>
      <Line
        ref={lineRef}
        {...config}
        points={flattenedPoints}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sceneFunc={(ctx, shape) => {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(start[0], start[1]);
          ctx.quadraticCurveTo(control[0], control[1], end[0], end[1]);

          ctx.restore();
          ctx.fillStrokeShape(shape);

          if (arrowStartHead === 'arrow') {
            drawArrowHead(ctx, shape, [end, control]);
          }

          if (arrowEndHead === 'arrow') {
            drawArrowHead(ctx, shape, [start, control]);
          }
        }}
      />
      {shouldTransformerRender && (
        <ArrowTransformer
          start={start}
          control={control}
          end={end}
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
