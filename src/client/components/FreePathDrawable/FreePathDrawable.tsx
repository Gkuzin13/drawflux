import {
  createDefaultNodeConfig,
  getStyleValues,
  Point,
} from '@/client/shared/element';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import useTransformer from '@/client/shared/hooks/useTransformer';
import Konva from 'konva';
import { Line } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import type { NodeComponentProps } from '../types';

const FreePathDrawable = ({
  node,
  draggable,
  selected,
  onNodeChange,
  onSelect,
}: NodeComponentProps) => {
  const { dash, strokeWidth } = getStyleValues(node.style);

  const { nodeRef, transformerRef } = useTransformer<Konva.Line>([selected]);

  useAnimatedLine(
    nodeRef.current,
    dash[0] + dash[1],
    node.style.animated,
    node.style.line,
  );

  const flattenedPoints = node.nodeProps.points?.flat() || [];

  const { nodeProps, style } = node;

  const config = createDefaultNodeConfig({
    visible: nodeProps.visible,
    strokeWidth,
    stroke: style.color,
    id: nodeProps.id,
    rotation: nodeProps.rotation,
    opacity: style.opacity,
    draggable,
    dash,
  });

  return (
    <>
      <Line
        ref={nodeRef}
        points={flattenedPoints}
        {...config}
        onDragStart={onSelect}
        onDragEnd={(event) => {
          if (!nodeRef.current) return;

          const points = nodeProps.points || [];

          const updatedPoints: Point[] = points.map((point) => {
            const { x, y } = nodeRef.current!.getAbsoluteTransform().point({
              x: point[0],
              y: point[1],
            });

            return [x, y];
          });

          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              points: updatedPoints,
            },
          });

          event.target.position({ x: 0, y: 0 });
        }}
        onTransformEnd={(event) => {
          const line = event.target as Konva.Rect;

          line.scaleX(1);
          line.scaleY(1);

          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              rotation: line.rotation(),
            },
          });
        }}
        onTap={onSelect}
        onClick={onSelect}
      />
      {selected && <NodeTransformer ref={transformerRef} />}
    </>
  );
};

export default FreePathDrawable;
