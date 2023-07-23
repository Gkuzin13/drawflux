import Icon from '../Icon/Icon';

type Props = {
  color?: string;
};

const ColorCircle = ({ color }: Props) => {
  return <Icon name="circleFilled" size="lg" color={color} />;
};

export default ColorCircle;
