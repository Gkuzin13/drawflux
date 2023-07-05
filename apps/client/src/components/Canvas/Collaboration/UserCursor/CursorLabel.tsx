import { memo } from 'react';
import { Label, Tag, Text } from 'react-konva';

type Props = {
  text: string;
  color: string;
};

const CursorLabel = ({ text, color }: Props) => {
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

export default memo(CursorLabel);
