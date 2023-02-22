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
  return (
    <NodeContainer
      nodeProps={nodeProps}
      style={style}
      onNodeChange={onNodeChange}
      {...restProps}
    >
      <Ellipse
        radiusX={nodeProps.width || 0}
        radiusY={nodeProps.height || 0}
        x={nodeProps.point[0]}
        y={nodeProps.point[1]}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const node = event.target as Konva.Ellipse;

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
              point: [node.x(), node.y()],
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
