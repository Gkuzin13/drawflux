import { memo } from 'react';
import type { NodeStyle } from 'shared';
import { ANIMATED } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';
import { createTitle } from '@/utils/string';

type Props = {
  value: NodeStyle['animated'];
  isDisabled: boolean;
  onAnimatedChange: (animated: NodeStyle['animated']) => void;
};

const AnimatedSection = ({ value, isDisabled, onAnimatedChange }: Props) => {
  const valueTitle = value ? 'On' : 'Off';

  return (
    <div aria-labelledby="shape-animated">
      <Styled.Label>{ANIMATED.name}</Styled.Label>
      <Styled.Toggle
        aria-label="Toggle Animated"
        title={createTitle(ANIMATED.name, valueTitle)}
        pressed={value}
        color={value ? 'primary' : 'secondary-light'}
        disabled={isDisabled}
        onPressedChange={onAnimatedChange}
      >
        {valueTitle}
      </Styled.Toggle>
    </div>
  );
};

export default memo(AnimatedSection, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isDisabled === nextProps.isDisabled
  );
});
