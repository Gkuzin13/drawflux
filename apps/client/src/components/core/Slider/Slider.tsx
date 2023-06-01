import {
  SliderContainer,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from './SliderStyled';

type Props = {
  value: number[];
  min?: number;
  max: number;
  label: string;
  step?: number;
  onValueChange: (value: number[]) => void;
};

const Slider = ({
  value,
  min = 0,
  max,
  step = 1,
  label,
  onValueChange,
}: Props) => {
  return (
    <SliderContainer
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
    >
      <SliderTrack>
        <SliderRange />
      </SliderTrack>
      <SliderThumb aria-label={label} />
    </SliderContainer>
  );
};

export default Slider;
