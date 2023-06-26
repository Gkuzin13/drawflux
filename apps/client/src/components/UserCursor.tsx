import type Konva from 'konva';
import { memo, useRef } from 'react';
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

const baseConfig: Konva.ShapeConfig = {
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
};

const UserCursor = ({ name, color, position, stageScale }: Props) => {
  const ref = useRef<Konva.Arrow>(null);

  const colorValue: ColorValue = colors[color] || '#000000';

  return (
    <Group
      x={position[0]}
      y={position[1]}
      scale={{
        x: 1 / stageScale,
        y: 1 / stageScale,
      }}
      listening={false}
      rotation={-130}
    >
      <Arrow
        ref={ref}
        points={[0]}
        pointerWidth={12}
        pointerLength={12}
        fill={colorValue}
        listening={false}
        {...baseConfig}
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
        {...baseConfig}
      />
    </Group>
  );
};

export default memo(UserCursor);
