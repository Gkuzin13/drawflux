import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useState } from 'react';
import { Line } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const FreePathDrawable = ({
  nodeProps,
  onNodeChange,
  ...restProps
}: NodeComponentProps) => {
  const [points, setPoints] = useState<Point[]>(nodeProps.points);

  const flattenedPoints = points.map((p) => [p.x, p.y]).flat();

  useEffect(() => {
    const lastPoints = nodeProps.points[nodeProps.points.length - 1];

    setPoints([...points, lastPoints]);
  }, [nodeProps.points]);

  return (
    <NodeContainer
      nodeProps={nodeProps}
      transformerConfig={{ enabledAnchors: [] }}
      onNodeChange={onNodeChange}
      {...restProps}
    >
      <Line
        id={nodeProps.id}
        points={flattenedPoints}
        rotation={nodeProps.rotation}
        onTransformEnd={(event: KonvaEventObject<Event>) => {
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
