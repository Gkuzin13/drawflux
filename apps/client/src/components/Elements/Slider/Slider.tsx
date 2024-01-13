import * as Styled from './Slider.styled';
import type { ComponentProps } from '@stitches/react';

type Props = {
  label: string;
} & ComponentProps<(typeof Styled)['Container']>;

const Slider = ({ step = 1, label, ...restProps }: Props) => {
  return (
    <Styled.Container step={step} {...restProps}>
      <Styled.Track>
        <Styled.Range />
      </Styled.Track>
      <Styled.Thumb
        aria-label={label}
        data-testid={`${label.toLowerCase().trim()}-slider`}
      />
    </Styled.Container>
  );
};

export default Slider;
