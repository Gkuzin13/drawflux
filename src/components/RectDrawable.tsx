import { getNormalizedPoints } from '@/shared/utils/draw';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Rect } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const RectDrawable = ({
  nodeProps,
  type,
  selected,
  draggable,
  onContextMenu,
  onNodeChange,
  onSelect,
}: NodeComponentProps) => {
  const { p1, p2 } = getNormalizedPoints(
    nodeProps.points[0],
    nodeProps.points[1],
  );

  return (
    <NodeContainer
      type={type}
      nodeProps={nodeProps}
      selected={selected}
      draggable={draggable}
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
        cornerRadius={2}
        onTransformEnd={(event: KonvaEventObject<Event>) => {
          if (!event.target) return;

          const node = event.target as Konva.Rect;

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
