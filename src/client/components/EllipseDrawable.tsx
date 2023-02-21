import { getNormalizedPoints } from '@/client/shared/utils/draw';
import Konva from 'konva';
import { Ellipse } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const CircleDrawable = ({
  nodeProps,
  style,
  onNodeChange,
  ...restProps
}: NodeComponentProps) => {
  const { p1, p2 } = getNormalizedPoints(
    nodeProps.points[0],
    nodeProps.points[1],
  );

  return (
    <NodeContainer
      nodeProps={nodeProps}
      style={style}
      onNodeChange={onNodeChange}
      {...restProps}
    >
      <Ellipse
        radiusX={p2.x - p1.x}
        radiusY={p2.y - p1.y}
        {...nodeProps}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const node = event.target as Konva.Circle;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            type: restProps.type,
            style,
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
