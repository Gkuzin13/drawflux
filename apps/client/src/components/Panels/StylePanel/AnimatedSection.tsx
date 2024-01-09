import { memo } from 'react';
import Toggle from '@/components/Elements/Toggle/Toggle';
import { ANIMATED } from '@/constants/panels/style';
import { createTitle } from '@/utils/string';
import * as Styled from './StylePanel.styled';
import type { NodeStyle } from 'shared';

type Props = {
  value: NodeStyle['animated'];
  isDisabled: boolean;
  onAnimatedChange: (animated: NodeStyle['animated']) => void;
};

const AnimatedSection = ({ value, isDisabled, onAnimatedChange }: Props) => {
  const valueTitle = value ? 'On' : 'Off';

  return (
    <Styled.InnerContainer aria-labelledby="shape-animated">
      <Styled.Label>{ANIMATED.name}</Styled.Label>
      <Toggle
        aria-label="Toggle Animated"
        title={createTitle(ANIMATED.name, valueTitle)}
        pressed={value}
        color={value ? 'primary' : 'secondary-light'}
        size="xs"
        disabled={isDisabled}
        onPressedChange={onAnimatedChange}
        squared
      >
        {valueTitle}
      </Toggle>
    </Styled.InnerContainer>
  );
};

export default memo(AnimatedSection, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isDisabled === nextProps.isDisabled
  );
});
