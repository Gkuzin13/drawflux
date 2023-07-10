import { memo } from 'react';
import type { NodeLine } from 'shared';
import { ICON_SIZES } from '@/constants/icon';
import { LINE } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';

type Props = {
  value?: NodeLine;
  onLineChange: (value: NodeLine) => void;
};

const LineSection = ({ value, onLineChange }: Props) => {
  return (
    <Styled.InnerContainer
      aria-label="Line"
      aria-labelledby="shape-line"
      orientation="horizontal"
      value={value}
      onValueChange={onLineChange}
    >
      <Styled.Label htmlFor="shape-line" css={{ fontSize: '$1' }}>
        Line
      </Styled.Label>
      <Styled.Grid>
        {LINE.map((line) => {
          return (
            <Styled.Item
              aria-label="Select Line"
              key={line.value}
              value={line.value}
              title={line.name}
              checked={line.value === value}
              color={line.value === value ? 'secondary' : 'secondary-light'}
            >
              {line.icon({ size: ICON_SIZES.LARGE })}
            </Styled.Item>
          );
        })}
      </Styled.Grid>
    </Styled.InnerContainer>
  );
};

export default memo(LineSection, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});