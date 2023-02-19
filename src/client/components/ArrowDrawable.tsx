import { useCallback, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Group, Line, Shape } from 'react-konva';
import TransformerAnchor from './ArrowTransformer/TransformerAnchor';
import { CURSOR } from '@/client/shared/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import type { NodeComponentProps } from './types';
import { getLineValue, getSizeValue, Point } from '../shared/element';
import { Context } from 'konva/lib/Context';
import type { Shape as ShapeType, ShapeConfig } from 'konva/lib/Shape';

let offset = 0;

const ArrowDrawable = ({
  nodeProps,
  type,
  style,
  selected,
  draggable,
  onContextMenu,
  onSelect,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState(nodeProps.points);

  const [start, end, control] = points;

  const PI2 = Math.PI * 2;

  const strokeWidth = getSizeValue(style.size);
  const dash = getLineValue(style.line);

  const lineRef = useRef<Konva.Line>(null);

  const { start: startMarch, stop } = animate(() => {
    if (!lineRef.current) return;
    offset++;

    if (offset > dash[0] * dash[1]) {
      offset = 0;
      return;
    }

    lineRef.current.dashOffset(-offset);
  }, 60);

  function animate(callback: () => void, frameRate = 60) {
    let requestId = 0;

    function start() {
      let then = performance.now();
      const interval = 1000 / frameRate;
      const tolerance = 0.1;

      const animateLoop = (now: number) => {
        requestId = requestAnimationFrame(animateLoop);

        const delta = now - then;
        if (delta >= interval - tolerance) {
          then = now - (delta % interval);
          callback();
        }
      };
      requestId = requestAnimationFrame(animateLoop);
    }

    function stop() {
      cancelAnimationFrame(requestId);
    }

    return { start, stop };
  }

  useEffect(() => {
    stop();
    startMarch();
  }, []);

  useEffect(() => {
    setPoints(nodeProps.points);
  }, [nodeProps.points]);

  const onAnchorDragMove = (event: KonvaEventObject<DragEvent>) => {
    if (!event.target) return;

    const node = event.target as Konva.Circle;
    const draggedIndex = node.attrs.id.split('-')[1];

    const updatedPoints = [...points];

    updatedPoints[draggedIndex] = { x: node.x(), y: node.y() };

    if (draggedIndex !== '2' && control) {
      updatedPoints[2] = clampAnchorPoint(
        getControlPointAfterDrag(
          updatedPoints[draggedIndex],
          points[draggedIndex],
          control,
        ),
      );
    }

    setPoints(updatedPoints);
  };

  function getControlPointAfterDrag(
    prevPoint: Point,
    draggedPoint: Point,
    controlPoint: Point,
  ) {
    // Calculate the displacement of the dragged point from its original position
    const displacement = {
      x: prevPoint.x - draggedPoint.x,
      y: prevPoint.y - draggedPoint.y,
    };

    // If the dragged point is not the middle point, move the middle point with it
    return {
      x: controlPoint.x + displacement.x,
      y: controlPoint.y + displacement.y,
    };
  }

  function getDefaultAnchorPoint(start: number, end: number) {
    return (start + end) / 2;
  }

  function clampAnchorPoint(position: Point) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Calculate the midpoint between the two points
    const mid = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };

    // Calculate a perpendicular vector to the line connecting the two points
    const perp = {
      x: dy / length,
      y: -dx / length,
    };

    // Calculate the distance of the drag from the midpoint along the perpendicular vector
    let dragDist =
      (position.x - mid.x) * perp.x + (position.y - mid.y) * perp.y;
    dragDist = Math.max(Math.min(dragDist, length / 2), -length / 2);

    return {
      x: mid.x + perp.x * dragDist,
      y: mid.y + perp.y * dragDist,
    };
  }

  function drawArrowHead(
    ctx: Context,
    shape: ShapeType<ShapeConfig>,
    end: Point,
    pointerRotationPoint: Point,
  ) {
    const dx = end.x - pointerRotationPoint.x;
    const dy = end.y - pointerRotationPoint.y;

    const radians = (Math.atan2(dy, dx) + PI2) % PI2;
    const length = 2.8 * strokeWidth;
    const width = 2.8 * strokeWidth;

    ctx.save();

    ctx.beginPath();
    ctx.translate(end.x, end.y);
    ctx.rotate(radians);

    ctx.moveTo(0, 0);
    ctx.lineTo(-length, width / 2);

    ctx.moveTo(0, 0);
    ctx.lineTo(-length, -width / 2);

    ctx.restore();
    ctx.setLineDash([0, 0]);
    ctx.fillStrokeShape(shape);
  }

  return (
    <Group
      id={nodeProps.id}
      cursorType={CURSOR.ALL_SCROLL}
      onSelect={onSelect}
      draggable={draggable}
      onDragEnd={(event: KonvaEventObject<DragEvent>) => {
        onNodeChange({
          type,
          style,
          text: null,
          nodeProps: {
            ...nodeProps,
            points,
            x: event.target.x(),
            y: event.target.y(),
          },
        });
      }}
      onContextMenu={(e) => onContextMenu(e, nodeProps.id)}
      onClick={onSelect}
      onTap={onSelect}
    >
      <Shape
        stroke={style.color as string}
        hitStrokeWidth={14}
        strokeWidth={strokeWidth}
        sceneFunc={(ctx, shape) =>
          drawArrowHead(ctx, shape, end, control ?? start)
        }
        lineCap="round"
      />
      <Line
        ref={lineRef}
        stroke={style.color as string}
        hitStrokeWidth={14}
        lineCap="round"
        strokeWidth={strokeWidth}
        dash={dash}
        sceneFunc={(ctx, shape) => {
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(
            control ? control.x : start.x,
            control ? control.y : start.y,
            end.x,
            end.y,
          );

          ctx.fillStrokeShape(shape);
        }}
      />
      {selected && (
        <>
          <TransformerAnchor
            key={`anchor-0`}
            id={`anchor-0`}
            x={start.x}
            y={start.y}
            onDragMove={onAnchorDragMove}
            draggable={draggable}
          />
          <TransformerAnchor
            key={`anchor-1`}
            id={`anchor-1`}
            x={end.x}
            y={end.y}
            onDragMove={onAnchorDragMove}
            draggable={draggable}
          />
          <TransformerAnchor
            key={`anchor-2`}
            id={`anchor-2`}
            active={control ? true : false}
            x={control ? control.x : getDefaultAnchorPoint(start.x, end.x)}
            y={control ? control.y : getDefaultAnchorPoint(start.y, end.y)}
            onDragMove={onAnchorDragMove}
            draggable={draggable}
            dragBoundFunc={clampAnchorPoint}
          />
        </>
      )}
    </Group>
  );
};

export default ArrowDrawable;
