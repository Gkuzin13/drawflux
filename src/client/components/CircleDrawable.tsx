import { getNormalizedPoints } from '@/client/shared/utils/draw';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Ellipse } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const CircleDrawable = ({
  nodeProps,
  selected,
  draggable,
  type,
  text,
  onNodeChange,
  onSelect,
  onContextMenu,
}: NodeComponentProps) => {
  const { p1, p2 } = getNormalizedPoints(
    nodeProps.points[0],
    nodeProps.points[1],
  );

  return (
    <NodeContainer
      type={type}
      text={text}
      nodeProps={nodeProps}
      selected={selected}
      draggable={draggable}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
    >
      <Ellipse
        stroke="black"
        radiusY={p2.y - p1.y}
        radiusX={p2.x - p1.x}
        {...nodeProps}
        onTransformEnd={(event: KonvaEventObject<Event>) => {
          if (!event.target) return;

          const node = event.target as Konva.Circle;

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
