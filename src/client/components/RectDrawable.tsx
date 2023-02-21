import { getNormalizedPoints } from '@/client/shared/utils/draw';
import Konva from 'konva';
import { Group, Rect } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const RectDrawable = ({
  nodeProps,
  onNodeChange,
  style,
  ...restProps
}: NodeComponentProps) => {
  const [p1, p2] = nodeProps.points;

  return (
    <NodeContainer
      nodeProps={nodeProps}
      onNodeChange={onNodeChange}
      style={style}
      {...restProps}
    >
      <Rect
        width={p2.x - p1.x}
        height={p2.y - p1.y}
        {...nodeProps}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const node = event.target as Konva.Rect;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            style,
            type: restProps.type,
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
