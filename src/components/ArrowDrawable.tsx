import { CURSOR_STYLES } from '@/shared/constants/base';
import Konva from 'konva';
import { useEffect, useState } from 'react';
import { Arrow, Circle, Group } from 'react-konva';
import TransformerAnchor from './ArrowTransformer/TransformerAnchor';
import type { NodeComponentProps } from './types';

const ArrowDrawable = ({
  nodeProps,
  type,
  isSelected,
  onContextMenu,
  onSelect,
  onNodeChange,
}: NodeComponentProps) => {
  const [points, setPoints] = useState(nodeProps.points);

  useEffect(() => {
    setPoints(nodeProps.points);
  }, [nodeProps]);

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
        onNodeChange({
          type,
          text: null,
          nodeProps: {
            ...nodeProps,
            points,
            x: e.target.x(),
            y: e.target.y(),
          },
        })
      }
      onContextMenu={(e) => onContextMenu(e, nodeProps.id)}
    >
      {isSelected && (
        <TransformerAnchor
          id="anchor1"
          x={points[0].x}
          y={points[0].y}
          onDragMove={onAnchorDragMove}
        />
      )}
      <Arrow
        id={nodeProps.id}
        stroke="black"
        fill="white"
        tension={0.2}
        cursorType={CURSOR_STYLES.ALL_SCROLL}
        pointerLength={16}
        pointerWidth={16}
        points={points.map((p) => [p.x, p.y]).flat()}
        hitStrokeWidth={14}
        onClick={onSelect}
        onTap={onSelect}
        lineJoin="round"
      />
      {isSelected && (
        <TransformerAnchor
          id="anchor2"
          x={points[1].x}
          y={points[1].y}
          onDragMove={onAnchorDragMove}
        />
      )}
    </Group>
  );
};

export default ArrowDrawable;
