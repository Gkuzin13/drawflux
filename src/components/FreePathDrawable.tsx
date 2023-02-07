import { useLayoutEffect, useState } from 'react';
import { Line } from 'react-konva';
import ShapeDrawable from './ShapeDrawable';
import type { DrawableProps, Point } from './types';

const FreePathDrawable = ({
  shapeProps,
  isSelected,
  onChange,
  onSelect,
}: DrawableProps) => {
  const [points, setPoints] = useState<Point[]>(shapeProps.points);

  const flattenedPoints = points.map((p) => [p.x, p.y]).flat();

  useLayoutEffect(() => {
    const lastPoints = shapeProps.points[shapeProps.points.length - 1];

    setPoints([...points, lastPoints]);
  }, [shapeProps.points]);

  return (
    <ShapeDrawable
      shapeProps={shapeProps}
      isSelected={isSelected}
      onChange={onChange}
      onSelect={onSelect}
    >
      <Line
        points={flattenedPoints}
        fill="black"
        stroke="black"
        strokeWidth={3}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={16}
      />
    </ShapeDrawable>
  );
};

export default FreePathDrawable;
