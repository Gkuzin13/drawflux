import { memo } from 'react';
import { Group } from 'react-konva';
import type { User, Point } from 'shared';
import { colors } from 'shared';
import CursorHead from './CursorHead';
import CursorLabel from './CursorLabel';

type ColorValue = (typeof colors)[User['color']];

type Props = {
  name: string;
  color: User['color'];
  position: Point;
  stageScale: number;
};

const UserCursor = ({ name, color, position, stageScale }: Props) => {
  const colorValue: ColorValue = colors[color] || '#000000';
  const normalizedScale = 1 / stageScale;

  return (
    <Group
      x={position[0]}
      y={position[1]}
      offset={{ x: -8, y: -12 }}
      scaleX={normalizedScale}
      scaleY={normalizedScale}
      listening={false}
      rotation={0}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
    >
      <CursorHead color={colorValue} />
      <CursorLabel text={name} color={colorValue} />
    </Group>
  );
};

export default memo(UserCursor);
