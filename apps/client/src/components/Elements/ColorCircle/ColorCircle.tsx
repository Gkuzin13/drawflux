import * as Styled from './ColorCircle.styled';

type Props = {
  color?: string;
};

const ColorCircle = ({ color }: Props) => {
  return <Styled.Root name="circleFilled" size="lg" color={color} />;
};

export default ColorCircle;
