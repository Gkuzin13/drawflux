import type Konva from 'konva';
import { memo, useRef } from 'react';
import { Arrow, Group, Text } from 'react-konva';
import { type User, colors } from 'shared';

type ColorValue = (typeof colors)[keyof typeof colors];

type Props = {
  user: User;
  stageScale: number;
};

const baseConfig: Konva.ShapeConfig = {
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
};

const CollaboratorCursor = ({ user, stageScale }: Props) => {
  const ref = useRef<Konva.Arrow>(null);

  const colorValue: ColorValue = colors[user.color] || '#000000';

  return (
    <Group
      x={user.position[0]}
      y={user.position[1]}
      scale={{
        x: 1 / stageScale,
        y: 1 / stageScale,
      }}
      opacity={0.95}
      listening={false}
    >
      <Arrow
        ref={ref}
        points={[0, 0]}
        pointerWidth={12}
        pointerLength={12}
        fill={colorValue}
        listening={false}
        {...baseConfig}
      />
      <Text
        text={user.name}
        fill={colorValue}
        listening={false}
        {...baseConfig}
      />
    </Group>
  );
};

export default memo(CollaboratorCursor);
