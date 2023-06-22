import type Konva from 'konva';
import { memo, useRef } from 'react';
import { Arrow, Group, Text } from 'react-konva';
import { type CollabUser, colors } from 'shared';

type Props = {
  user: CollabUser;
  stageScale: number;
};

const baseConfig: Konva.ShapeConfig = {
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
};

const CollaboratorCursor = ({ user, stageScale }: Props) => {
  const ref = useRef<Konva.Arrow>(null);

  function getColor(name: CollabUser['color']) {
    return colors[name];
  }

  const colorValue = getColor(user.color);

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
