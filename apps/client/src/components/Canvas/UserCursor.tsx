import { memo } from 'react';
import { Group, Label, Path, Tag, Text } from 'react-konva';
import type { User, Point } from 'shared';
import { colors } from 'shared';

type ColorValue = (typeof colors)[User['color']];

type Props = {
  name: string;
  color: User['color'];
  position: Point;
  stageScale: number;
};

type LabelProps = {
  text: string;
  color: string;
};

type CursorHeadProps = {
  color: string;
};

const CursorHead = ({ color }: CursorHeadProps) => {
  return (
    <Path
      rotation={-124}
      offset={{ x: 0, y: 6 }}
      scale={{ x: 1.2, y: 1.2 }}
      fill={color}
      opacity={0.8}
      data="M2.99811 5.2467L3.43298 6.00772C3.70983 6.4922 3.84825 6.73444 3.84825 7C3.84825 7.26556 3.70983 7.5078 3.43299 7.99227L3.43298 7.99228L2.99811 8.7533C1.75981 10.9203 1.14066 12.0039 1.62348 12.5412C2.1063 13.0785 3.24961 12.5783 5.53623 11.5779L11.8119 8.83231C13.6074 8.04678 14.5051 7.65402 14.5051 7C14.5051 6.34598 13.6074 5.95322 11.8119 5.16769L5.53624 2.4221C3.24962 1.42171 2.1063 0.921508 1.62348 1.45883C1.14066 1.99615 1.75981 3.07966 2.99811 5.2467Z"
    />
  );
};

const CursorLabel = ({ text, color }: LabelProps) => {
  return (
    <Label>
      <Tag fill={color} cornerRadius={6} opacity={0.1} />
      <Text
        text={text}
        fontStyle="bold"
        fill={color}
        padding={8}
        lineHeight={0.9}
      />
    </Label>
  );
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
