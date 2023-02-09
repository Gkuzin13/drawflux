import Konva from 'konva';
import { Rect } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const RectDrawable = ({
  nodeProps,
  type,
  isSelected,
  onContextMenu,
  onNodeChange,
  onSelect,
}: NodeComponentProps) => {
  const [p1, p2] = nodeProps.points;

  return (
    <NodeContainer
      type={type}
      nodeProps={nodeProps}
      isSelected={isSelected}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
      text={null}
    >
      <Rect
        width={p2.x - p1.x}
        height={p2.y - p1.y}
        x={p1.x}
        y={p1.y}
        rotation={nodeProps.rotation}
        stroke="black"
        hitStrokeWidth={16}
        onTransformEnd={(e: any) => {
          if (!e.target) return;

          const node = e.target as Konva.Rect;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            type,
            text: null,
            nodeProps: {
              ...nodeProps,
              points: [
                { x: node.x(), y: node.y() },
                {
                  x: Math.max(5, node.width() * scaleX) + node.x(),
                  y: Math.max(node.height() * scaleY) + node.y(),
                },
              ],
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default RectDrawable;
