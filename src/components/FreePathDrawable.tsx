import { useEffect, useState } from 'react';
import { Line } from 'react-konva';
import NodeContainer from './NodeContainer';
import type { DrawableProps, Point } from './types';

const FreePathDrawable = ({
  shapeProps,
  type,
  isSelected,
  onChange,
  onSelect,
  onContextMenu,
}: DrawableProps) => {
  const [points, setPoints] = useState<Point[]>(shapeProps.points);

  const flattenedPoints = points.map((p) => [p.x, p.y]).flat();

  useEffect(() => {
    const lastPoints = shapeProps.points[shapeProps.points.length - 1];

    setPoints([...points, lastPoints]);
  }, [shapeProps.points]);

  return (
    <NodeContainer
      isDrawable={true}
      type={type}
      shapeProps={shapeProps}
      isSelected={isSelected}
      onChange={onChange}
      onSelect={onSelect}
      onContextMenu={onContextMenu}
    >
      <Line
        id={shapeProps.id}
        points={flattenedPoints}
        fill="black"
        stroke="black"
        strokeWidth={3}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={16}
      />
    </NodeContainer>
  );
};

export default FreePathDrawable;
