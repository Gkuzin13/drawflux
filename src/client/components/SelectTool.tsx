import { getNormalizedPoints } from '@/client/shared/utils/draw';
import { Rect } from 'react-konva';
import { Point } from '../shared/element';

type Props = {
  points: Point[];
};

const SelectTool = ({ points }: Props) => {
  const { p1, p2 } = getNormalizedPoints(points[0], points[1]);

  return (
    <Rect
      stroke="gray"
      fill="rgba(0,0,0, 0.1)"
      width={p2.x - p1.x}
      height={p2.y - p1.y}
      x={p1.x}
      y={p1.y}
    />
  );
};

export default SelectTool;
