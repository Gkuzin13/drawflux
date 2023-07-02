import * as Styled from './Slider.styled';

type Props = {
  value: number[];
  min?: number;
  max: number;
  label: string;
  step?: number;
  onValueChange: (value: number[]) => void;
  onValueCommit: (value: number[]) => void;
};

const Slider = ({
  value,
  min = 0,
  max,
  step = 1,
  label,
  onValueChange,
  onValueCommit,
}: Props) => {
  return (
    <Styled.Container
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
    >
      <Styled.Track>
        <Styled.Range />
      </Styled.Track>
      <Styled.Thumb aria-label={label} />
    </Styled.Container>
  );
};

export default Slider;
