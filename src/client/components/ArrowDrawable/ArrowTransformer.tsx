import { Point } from '@/client/shared/element';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import TransformerAnchor from './TransformerAnchor';

type Props = {
  points: [Point, Point, Point];
  visible: boolean;
  draggable: boolean;
  onTransform: (updatedPoints: Point[]) => void;
  onTransformEnd: (points: Point[]) => void;
};

const ANCHOR_INDEX = {
  START: 0,
  CONTROL: 1,
  END: 2,
} as const;

const ArrowTransformer = ({
  points,
  draggable,
  visible,
  onTransform,
  onTransformEnd,
}: Props) => {
  const [start, control, end] = points;

  const onAnchorDragMove = (
    event: KonvaEventObject<DragEvent>,
    index: number,
  ) => {
    const node = event.target as Konva.Circle;

    const updatedPoints = [...points];

    updatedPoints[index] = [node.x(), node.y()];

    onTransform(updatedPoints);
  };

  const onAnchorDragEnd = () => {
    onTransformEnd(points);
  };

  return (
    <>
      <TransformerAnchor
        key={0}
        x={start[0]}
        y={start[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.START)}
        onDragEnd={onAnchorDragEnd}
        draggable
        visible={visible}
      />
      <TransformerAnchor
        key={1}
        active={true}
        x={control[0]}
        y={control[1]}
        visible={visible}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.CONTROL)}
        onDragEnd={onAnchorDragEnd}
        draggable={draggable}
      />
      <TransformerAnchor
        key={2}
        x={end[0]}
        y={end[1]}
        onDragMove={(event) => onAnchorDragMove(event, ANCHOR_INDEX.END)}
        onDragEnd={onAnchorDragEnd}
        draggable
        visible={visible}
      />
    </>
  );
};

export default ArrowTransformer;
