import * as Styled from './ColorCircle.styled';

type Props = {
  color?: string;
};

const ColorCircle = ({ color }: Props) => {
  return <Styled.Root name="circleFilled" color={color} />;
};

export default ColorCircle;
