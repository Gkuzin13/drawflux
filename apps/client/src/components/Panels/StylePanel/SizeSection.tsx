import { memo } from 'react';
import type { NodeSize } from 'shared';
import { SIZE } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';
import { getStyleTitle } from '@/utils/string';
import Icon from '@/components/Elements/Icon/Icon';
import { getSizeValue } from '@/utils/shape';

type Props = {
  value?: NodeSize;
  onSizeChange: (size: NodeSize) => void;
};

const SizeSection = ({ value, onSizeChange }: Props) => {
  return (
    <Styled.InnerContainer
      aria-label="Size"
      aria-labelledby="shape-size"
      orientation="horizontal"
      value={value}
      onValueChange={onSizeChange}
    >
      <Styled.Label>Size</Styled.Label>
      <Styled.Grid>
        {SIZE.map((size) => {
          return (
            <Styled.Item
              key={size.name}
              title={getStyleTitle('Size', size.name)}
              value={size.value}
              checked={size.value === value}
              color={size.value === value ? 'secondary' : 'secondary-light'}
            >
              <Icon name={size.icon} stroke={getSizeValue(size.value)} />
            </Styled.Item>
          );
        })}
      </Styled.Grid>
    </Styled.InnerContainer>
  );
};

export default memo(SizeSection, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});
