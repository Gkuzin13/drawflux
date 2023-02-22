import Konva from 'konva';
import { Rect } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const RectDrawable = ({
  nodeProps,
  onNodeChange,
  style,
  ...restProps
}: NodeComponentProps) => {
  return (
    <NodeContainer
      nodeProps={nodeProps}
      onNodeChange={onNodeChange}
      style={style}
      {...restProps}
    >
      <Rect
        x={nodeProps.point[0]}
        y={nodeProps.point[1]}
        width={nodeProps.width}
        height={nodeProps.height}
        cornerRadius={1}
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
              point: [node.x(), node.y()],
              width: Math.max(5, node.width() * scaleX) + node.x(),
              height: Math.max(node.height() * scaleY) + node.y(),
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default RectDrawable;
