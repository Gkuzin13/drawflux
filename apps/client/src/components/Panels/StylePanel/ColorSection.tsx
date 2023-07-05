import { memo } from 'react';
import { colors, type NodeColor } from 'shared';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import * as Styled from './StylePanel.styled';

type Props = {
  value?: NodeColor;
  onColorChange: (color: NodeColor) => void;
};

const ColorSection = ({ value, onColorChange }: Props) => {
  return (
    <Styled.InnerContainer
      defaultValue={value}
      aria-label="Color"
      aria-labelledby="shape-color"
      orientation="horizontal"
      value={value}
      onValueChange={onColorChange}
    >
      <Styled.Label htmlFor="shape-color" css={{ fontSize: '$1' }}>
        Color
      </Styled.Label>
      <ColorsGrid value={value || colors.black} onSelect={onColorChange} />
    </Styled.InnerContainer>
  );
};

export default memo(ColorSection, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
