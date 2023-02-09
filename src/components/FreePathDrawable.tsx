import { Point } from '@/shared/constants/base';
import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Line } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { NodeComponentProps } from './types';

const FreePathDrawable = ({
  nodeProps,
  type,
  text,
  isSelected,
  onNodeChange,
  onSelect,
  onContextMenu,
}: NodeComponentProps) => {
  const [points, setPoints] = useState<Point[]>(nodeProps.points);

  const flattenedPoints = points.map((p) => [p.x, p.y]).flat();

  useEffect(() => {
    const lastPoints = nodeProps.points[nodeProps.points.length - 1];

    setPoints([...points, lastPoints]);
  }, [nodeProps.points]);

  return (
    <NodeContainer
      type={type}
      text={null}
      nodeProps={nodeProps}
      isSelected={isSelected}
      onNodeChange={onNodeChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
      transformerConfig={{ enabledAnchors: [] }}
    >
      <Line
        id={nodeProps.id}
        points={flattenedPoints}
        rotation={nodeProps.rotation}
        perfectDrawEnabled={false}
        fill="black"
        stroke="black"
        strokeWidth={3}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        onTransformEnd={(e: any) => {
          if (!e.target) return;

          const node = e.target as Konva.Rect;

          node.scaleX(1);
          node.scaleY(1);

          onNodeChange({
            type,
            text,
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
