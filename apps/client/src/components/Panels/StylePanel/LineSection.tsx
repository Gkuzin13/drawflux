import { memo } from 'react';
import type { NodeLine } from 'shared';
import { LINE } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';
import { getStyleTitle } from '@/utils/string';
import Icon from '@/components/Elements/Icon/Icon';

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
      <Styled.Label>Line</Styled.Label>
      <Styled.Grid>
        {LINE.map((line) => {
          return (
            <Styled.Item
              key={line.value}
              value={line.value}
              title={getStyleTitle('Line', line.name)}
              checked={line.value === value}
              color={line.value === value ? 'secondary' : 'secondary-light'}
            >
              <Icon name={line.icon} size="lg" />
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
