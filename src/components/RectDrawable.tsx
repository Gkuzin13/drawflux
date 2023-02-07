import Konva from 'konva';
import { Rect } from 'react-konva';
import ShapeDrawable from './ShapeDrawable';
import type { DrawableProps } from './types';

const RectDrawable = ({
  shapeProps,
  isSelected,
  onChange,
  onSelect,
}: DrawableProps) => {
  const [p1, p2] = shapeProps.points;

  return (
    <ShapeDrawable
      shapeProps={shapeProps}
      isSelected={isSelected}
      onChange={onChange}
      onSelect={onSelect}
    >
      <Rect
        width={p2.x - p1.x}
        height={p2.y - p1.y}
        x={p1.x}
        y={p1.y}
        stroke="black"
        hitStrokeWidth={16}
        onTransformEnd={(e: any) => {
          if (!e.target) return;

          const node = e.target as Konva.Rect;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            shapeProps: {
              ...shapeProps,
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
    </ShapeDrawable>
  );
};

export default RectDrawable;
