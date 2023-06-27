import { memo } from 'react';
import { Arrow, Group, Text } from 'react-konva';
import type { User, Point } from 'shared';
import { colors } from 'shared';

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
      scaleX={normalizedScale}
      scaleY={normalizedScale}
      listening={false}
      rotation={-130}
      perfectDrawEnabled={false}
      shadowForStrokeEnabled={false}
    >
      <Arrow
        points={[0]}
        pointerWidth={12}
        pointerLength={12}
        fill={colorValue}
        listening={false}
      />
      <Text
        text={name}
        fill={colorValue}
        listening={false}
        fontStyle="bold"
        rotation={130}
        offsetX={-20}
        offsetY={-2}
        opacity={0.5}
      />
    </Group>
  );
};

export default memo(UserCursor);
