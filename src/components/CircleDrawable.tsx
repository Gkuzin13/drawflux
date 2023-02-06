import Konva from 'konva';
import { Circle } from 'react-konva';
import ShapeDrawable from './ShapeDrawable';
import type { DrawableProps } from './types';

const CircleDrawable = ({
  shapeProps,
  isSelected,
  onChange,
  onSelect,
}: DrawableProps) => {
  const [p1, p2] = shapeProps.points;

  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  const radius = Math.sqrt(dx * dx + dy * dy);

  return (
    <ShapeDrawable
      shapeProps={shapeProps}
      isSelected={isSelected}
      onChange={onChange}
      onSelect={onSelect}
    >
      <Circle
        stroke="black"
        radius={radius}
        {...shapeProps}
        onTransformEnd={(e: any) => {
          if (!e.target) return;

          const node = e.target as Konva.Circle;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
    </ShapeDrawable>
  );
};

export default CircleDrawable;
