import { memo } from 'react';
import type { NodeFill } from 'shared';
import { ICON_SIZES } from '@/constants/icon';
import { FILL } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';
import { getStyleTitle } from '@/utils/string';

type FillValue = Exclude<NodeFill, undefined>;

type Props = {
  value?: NodeFill;
  onFillChange: (value: FillValue) => void;
};

const FillSection = ({ value, onFillChange }: Props) => {
  return (
    <Styled.InnerContainer
      aria-label="Fill"
      aria-labelledby="shape-fill"
      orientation="horizontal"
      value={value}
      onValueChange={onFillChange}
    >
      <Styled.Label>Fill</Styled.Label>
      <Styled.Grid>
        {FILL.map((fill) => {
          return (
            <Styled.Item
              key={fill.value}
              value={fill.value ?? 'none'}
              title={getStyleTitle('Fill', fill.name)}
              checked={fill.value === value}
              color={fill.value === value ? 'secondary' : 'secondary-light'}
            >
              {fill.icon({ size: ICON_SIZES.LARGE })}
            </Styled.Item>
          );
        })}
      </Styled.Grid>
    </Styled.InnerContainer>
  );
};

export default memo(FillSection, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
