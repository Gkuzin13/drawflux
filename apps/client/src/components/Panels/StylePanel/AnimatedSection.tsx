import { memo } from 'react';
import type { NodeStyle } from 'shared';
import { ANIMATED } from '@/constants/panels/style';
import * as Styled from './StylePanel.styled';

type Props = {
  value: NodeStyle['animated'];
  isDisabled: boolean;
  onAnimatedChange: (animated: NodeStyle['animated']) => void;
};

const AnimatedSection = ({ value, isDisabled, onAnimatedChange }: Props) => {
  return (
    <div aria-labelledby="shape-animated">
      <Styled.Label>Animated</Styled.Label>
      <Styled.Toggle
        aria-label="Toggle Animated"
        title={ANIMATED.name}
        pressed={value}
        color={value ? 'primary' : 'secondary-light'}
        disabled={isDisabled}
        onPressedChange={onAnimatedChange}
      >
        {value ? 'On' : 'Off'}
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
