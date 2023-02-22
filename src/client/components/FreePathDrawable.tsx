import Konva from 'konva';
import { Line } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const FreePathDrawable = ({
  nodeProps,
  onNodeChange,
  ...restProps
}: NodeComponentProps) => {
  const flattenedPoints = nodeProps.points?.flat() || [];

  return (
    <NodeContainer
      nodeProps={nodeProps}
      transformerConfig={{ enabledAnchors: [] }}
      onNodeChange={onNodeChange}
      {...restProps}
    >
      <Line
        points={flattenedPoints}
        rotation={nodeProps.rotation}
        onTransformEnd={(event) => {
          if (!event.target) return;

          const node = event.target as Konva.Rect;

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            type: restProps.type,
            text: null,
            style: restProps.style,
            nodeProps: {
              ...nodeProps,
              rotation: node.rotation(),
            },
          });
        }}
      />
    </NodeContainer>
  );
};

export default FreePathDrawable;
