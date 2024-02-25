import { useCallback, useEffect, useRef } from 'react';
import { Circle, Group } from 'react-konva';
import { calculateClampedMidPoint, getAnchorType } from './helpers';
import { ARROW_TRANSFORMER } from '@/constants/shape';
import useDefaultThemeColors from '@/hooks/useThemeColors';
import { hexToRGBa } from '@/utils/string';
import { calculateMidPointFromRange } from '@/utils/math';
import { inRange } from '@/utils/position';
import {
  resetCursor,
  setCursor,
} from '@/components/Canvas/DrawingCanvas/helpers/cursor';
import type { Point } from 'shared';
import type Konva from 'konva';

export type AnchorType = 'start' | 'control' | 'end';
type AnchorPoint = {
  type: AnchorType;
  point: Point;
};
export type OnTransformFnParams = {
  point: Point;
  anchorType: AnchorType;
};
type OnTransformFn = (params: OnTransformFnParams) => void;
type ArrowTransformerProps = {
  start: Point;
  control: Point;
  end: Point;
  stageScale: number;
  onTranformStart: OnTransformFn;
  onTransform: OnTransformFn;
  onTransformEnd: OnTransformFn;
};
type AnchorProps = Konva.CircleConfig & { type: AnchorType };

const Anchor = ({
  x,
  y,
  type,
  scale,
  onDragStart,
  onDragMove,
  onDragEnd,
  ...restProps
}: AnchorProps) => {
  const themeColors = useDefaultThemeColors();

  const handleMouseEnter = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;

      const stage = event.target.getStage();
      const circle = event.target as Konva.Circle;

      circle.strokeWidth(ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH_HOVER);
      circle.stroke(hexToRGBa(ARROW_TRANSFORMER.STROKE, 0.75));

      setCursor(stage, 'grab');
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent>) => {
      event.cancelBubble = true;

      const stage = event.target.getStage();
      const circle = event.target as Konva.Circle;

      circle.strokeWidth(ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH);
      circle.stroke(ARROW_TRANSFORMER.STROKE);

      resetCursor(stage);
    },
    [],
  );

  return (
    <Circle
      x={x}
      y={y}
      scale={scale}
      stroke={ARROW_TRANSFORMER.STROKE}
      fill={themeColors['canvas-bg'].value}
      strokeWidth={ARROW_TRANSFORMER.ANCHOR_STROKE_WIDTH}
      hitStrokeWidth={ARROW_TRANSFORMER.HIT_STROKE_WIDTH}
      radius={ARROW_TRANSFORMER.RADIUS}
      name={ARROW_TRANSFORMER.ANCHOR_NAME}
      type={type}
      fillAfterStrokeEnabled={true}
      draggable={true}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...restProps}
    />
  );
};

const ArrowTransformer = ({
  start,
  control,
  end,
  stageScale,
  onTranformStart,
  onTransform,
  onTransformEnd,
}: ArrowTransformerProps) => {
  const transformerRef = useRef<Konva.Group>(null);

  const normalizedScale = 1 / stageScale;

  const anchors: AnchorPoint[] = [
    {
      type: 'start',
      point: start,
    },
    {
      type: 'control',
      point: control,
    },
    {
      type: 'end',
      point: end,
    },
  ];

  useEffect(() => {
    transformerRef.current?.moveToTop();
  }, []);

  const handleAnchorDragStart = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const node = event.target as Konva.Circle;
      const anchorType = getAnchorType(node);

      if (anchorType) {
        const { x, y } = node.position();

        onTranformStart({ anchorType, point: [x, y] });
      }
    },
    [onTranformStart],
  );

  const handleAnchorDragMove = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const node = event.target as Konva.Circle;
      const anchorType = getAnchorType(node);

      if (!anchorType) {
        return;
      }

      const { x, y } = node.position();

      if (anchorType === 'control') {
        let updatedPoint = calculateClampedMidPoint([x, y], start, end);
        const mid = calculateMidPointFromRange(start, end);
        const offset = ARROW_TRANSFORMER.SNAP_OFFSET;

        if (
          inRange(updatedPoint[0], mid[0] - offset, mid[0] + offset) &&
          inRange(updatedPoint[1], mid[1] - offset, mid[1] + offset)
        ) {
          updatedPoint = mid;
        }

        node.position({ x: updatedPoint[0], y: updatedPoint[1] });

        onTransform({ anchorType, point: updatedPoint });
        return;
      }

      onTransform({ anchorType, point: [x, y] });
    },
    [start, end, onTransform],
  );

  const handleAnchorDragEnd = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const node = event.target as Konva.Circle;
      const anchorType = getAnchorType(node);

      if (anchorType) {
        const { x, y } = node.position();

        onTransformEnd({ anchorType, point: [x, y] });
      }
    },
    [onTransformEnd],
  );

  return (
    <Group ref={transformerRef}>
      {anchors.map((anchor) => {
        return (
          <Anchor
            key={anchor.type}
            type={anchor.type}
            x={anchor.point[0]}
            y={anchor.point[1]}
            scaleX={normalizedScale}
            scaleY={normalizedScale}
            onDragStart={handleAnchorDragStart}
            onDragMove={handleAnchorDragMove}
            onDragEnd={handleAnchorDragEnd}
          />
        );
      })}
    </Group>
  );
};

export default ArrowTransformer;
