import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Arrow, Circle, Group } from 'react-konva';
import type { DrawableProps } from './types';

const ArrowDrawable = ({
  shapeProps,
  isSelected,
  onContextMenu,
  onSelect,
  onChange,
}: DrawableProps) => {
  const [points, setPoints] = useState(shapeProps.points);

  useEffect(() => {
    setPoints(shapeProps.points);
  }, [shapeProps]);

  const onAnchorDragMove = (e: any) => {
    if (!e.target) return;

    const node = e.target as Konva.Circle;
    const { id } = node.attrs;

    if (id === 'anchor1') {
      const updatedPoints = [{ x: node.x(), y: node.y() }, points[1]];

      setPoints(updatedPoints);
      return;
    }

    const updatedPoints = [points[0], { x: node.x(), y: node.y() }];

    setPoints(updatedPoints);
  };

  return (
    <Group
      onSelect={onSelect}
      draggable={true}
      onDragEnd={(e: any) =>
        onChange({
          shapeProps: {
            ...shapeProps,
            points,
            x: e.target.x(),
            y: e.target.y(),
          },
        })
      }
      onContextMenu={(e) => onContextMenu(e, shapeProps.id)}
    >
      {isSelected && (
        <Circle
          x={points[0].x}
          y={points[0].y}
          visible={isSelected}
          id="anchor1"
          fill="gray"
          radius={6}
          draggable={true}
          onDragMove={onAnchorDragMove}
        />
      )}
      <Arrow
        stroke="black"
        fill="white"
        tension={0.2}
        pointerLength={16}
        pointerWidth={16}
        points={points.map((p) => [p.x, p.y]).flat()}
        hitStrokeWidth={48}
        id={shapeProps.id}
        onClick={onSelect}
        onTap={onSelect}
      />
      {isSelected && (
        <Circle
          x={points[1].x}
          y={points[1].y}
          visible={isSelected}
          id="anchor2"
          fill="gray"
          radius={6}
          draggable={true}
          onDragMove={onAnchorDragMove}
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
