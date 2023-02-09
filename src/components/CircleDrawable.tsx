import Konva from 'konva';
import { Circle } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const CircleDrawable = ({
  nodeProps,
  isSelected,
  type,
  text,
  onNodeChange,
  onSelect,
  onContextMenu,
}: NodeComponentProps) => {
  const [p1, p2] = nodeProps.points;

  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  const radius = Math.sqrt(dx * dx + dy * dy);

  return (
    <NodeContainer
      type={type}
      text={text}
      nodeProps={nodeProps}
      isSelected={isSelected}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
    >
      <Circle
        stroke="black"
        radius={radius}
        {...nodeProps}
        hitStrokeWidth={16}
        onTransformEnd={(e: any) => {
          if (!e.target) return;

          const node = e.target as Konva.Circle;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            type,
            text: null,
            nodeProps: {
              ...nodeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default CircleDrawable;
