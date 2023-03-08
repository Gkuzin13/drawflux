import { createDefaultNodeConfig } from '@/client/shared/constants/element';
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
  const { nodeRef, transformerRef } = useTransformer<Konva.Line>([selected]);

  useAnimatedLine(
    nodeRef.current,
    node.style.line[0] + node.style.line[1],
    node.style.animated,
    node.style.line,
  );

  const flattenedPoints = node.nodeProps.points?.flat() || [];

  const { nodeProps, style } = node;

  const config = createDefaultNodeConfig({
    visible: nodeProps.visible,
    strokeWidth: node.style.size,
    stroke: style.color,
    id: nodeProps.id,
    rotation: nodeProps.rotation,
    opacity: style.opacity,
    draggable,
    dash: node.style.line,
  });

  return (
    <>
      <Line
        ref={nodeRef}
        points={flattenedPoints}
        {...config}
        onDragStart={() => onPress(node.nodeProps.id)}
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
        onTap={() => onPress(node.nodeProps.id)}
        onClick={() => onPress(node.nodeProps.id)}
      />
      {selected && <NodeTransformer ref={transformerRef} />}
    </>
  );
};

export default FreePathDrawable;
