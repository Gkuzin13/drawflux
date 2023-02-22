import { normalizePoints } from '@/client/shared/utils/draw';
import { Rect } from 'react-konva';
import { Point } from '../shared/element';

type Props = {
  points: Point[];
};

const SelectTool = ({ points }: Props) => {
  const [p1, p2] = normalizePoints(points[0], points[1]);

  return (
    <Rect
      stroke="gray"
      fill="rgba(0,0,0, 0.1)"
      width={p2[0] - p1[0]}
      height={p2[1] - p1[1]}
      x={p1[0]}
      y={p1[1]}
    />
  );
};

export default SelectTool;
