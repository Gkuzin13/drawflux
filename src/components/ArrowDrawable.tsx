import { useEffect, useState } from 'react';
import Konva from 'konva';
import { Group, Shape } from 'react-konva';
import TransformerAnchor from './ArrowTransformer/TransformerAnchor';
import { CURSOR_STYLES } from '@/shared/constants/base';
import type { NodeComponentProps } from './types';

const ArrowDrawable = ({
  nodeProps,
  type,
  isSelected,
  onContextMenu,
  onSelect,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState(nodeProps.points);

  useEffect(() => {
    setPoints(nodeProps.points);
  }, [nodeProps.points]);

  const middlePointActive = points[2] ? true : false;

  const onAnchorDragMove = (e: any) => {
    if (!e.target) return;

    const node = e.target as Konva.Circle;
    const updatedIndex = node.attrs.id.split('-')[1];

    let updatedPoints = [...points];

    updatedPoints[updatedIndex] = { x: node.x(), y: node.y() };

    setPoints(updatedPoints);
  };

  const onAnchorDragEnd = () => {
    onNodeChange({
      type,
      text: null,
      nodeProps: {
        ...nodeProps,
        points: points,
      },
    });
  };

  function getDefaultAnchorPoint(start: number, end: number) {
    return (start + end) / 2;
  }

  return (
    <Group
      onSelect={onSelect}
      draggable={true}
      onDragEnd={(e: any) => {
        onNodeChange({
          type,
          text: null,
          nodeProps: {
            ...nodeProps,
            points,
            x: e.target.x(),
            y: e.target.y(),
          },
        });
      }}
      onContextMenu={(e) => onContextMenu(e, nodeProps.id)}
    >
      <Shape
        id={nodeProps.id}
        cursorType={CURSOR_STYLES.ALL_SCROLL}
        stroke="black"
        hitStrokeWidth={14}
        sceneFunc={(ctx, shape) => {
          // Draw lines
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          if (middlePointActive) {
            ctx.lineTo(points[2].x, points[2].y);
          }
          ctx.lineTo(points[1].x, points[1].y);
          ctx.fillStrokeShape(shape);

          // Draw arrow pointer
          const PI2 = Math.PI * 2;

          const pointerRotationPoint = middlePointActive ? 2 : 0;
          const dx = points[1].x - points[pointerRotationPoint].x;
          const dy = points[1].y - points[pointerRotationPoint].y;

          const radians = (Math.atan2(dy, dx) + PI2) % PI2;
          const length = 24;
          const width = 18;

          ctx.save();
          ctx.beginPath();
          ctx.translate(points[1].x, points[1].y);
          ctx.rotate(radians);
          ctx.moveTo(0, 0);
          ctx.lineTo(-length, width / 2);
          ctx.moveTo(0, 0);
          ctx.lineTo(-length, -width / 2);
          ctx.restore();
          ctx.fillStrokeShape(shape);
        }}
        onClick={onSelect}
        onTap={onSelect}
      />
      {isSelected && (
        <>
          <TransformerAnchor
            key={`anchor-0`}
            id={`anchor-0`}
            x={points[0].x}
            y={points[0].y}
            onDragMove={onAnchorDragMove}
          />
          <TransformerAnchor
            key={`anchor-1`}
            id={`anchor-1`}
            x={points[1].x}
            y={points[1].y}
            onDragMove={onAnchorDragMove}
          />
          <TransformerAnchor
            key={`anchor-2`}
            id={`anchor-2`}
            active={middlePointActive}
            x={
              middlePointActive
                ? points[2].x
                : getDefaultAnchorPoint(points[0].x, points[1].x)
            }
            y={
              middlePointActive
                ? points[2].y
                : getDefaultAnchorPoint(points[0].y, points[1].y)
            }
            onDragMove={onAnchorDragMove}
          />
        </>
      )}
    </Group>
  );
};

export default ArrowDrawable;
