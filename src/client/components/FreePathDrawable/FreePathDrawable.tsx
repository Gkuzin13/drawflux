import {
  createDefaultNodeConfig,
  getStyleValues,
} from '@/client/shared/element';
import useAnimatedLine from '@/client/shared/hooks/useAnimatedLine';
import useTransformer from '@/client/shared/hooks/useTransformer';
import { getPointsAbsolutePosition } from '@/client/shared/utils/position';
import Konva from 'konva';
import { Line } from 'react-konva';
import NodeTransformer from '../NodeTransformer';
import type { NodeComponentProps } from '../types';

const FreePathDrawable = ({
  node,
  draggable,
  selected,
  onNodeChange,
  onPress,
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
        onDragStart={onPress}
        onDragEnd={(event) => {
          const line = event.target as Konva.Line;
          const stage = line.getStage() as Konva.Stage;

          const points = nodeProps.points || [];

          const updatedPoints = getPointsAbsolutePosition(points, line, stage);

          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              points: updatedPoints,
            },
          });

          line.position({ x: 0, y: 0 });
        }}
        onTransformEnd={(event) => {
          const line = event.target as Konva.Line;
          const stage = line.getStage() as Konva.Stage;

          const points = nodeProps.points || [];

          const updatedPoints = getPointsAbsolutePosition(points, line, stage);

          onNodeChange({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              points: updatedPoints,
              rotation: line.rotation(),
            },
          });

          line.scale({ x: 1, y: 1 });
          line.position({ x: 0, y: 0 });
        }}
        onTap={onPress}
        onClick={onPress}
      />
      {selected && <NodeTransformer ref={transformerRef} />}
    </>
  );
};

export default FreePathDrawable;
