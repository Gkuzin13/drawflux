import { type IconBaseProps } from 'react-icons';
import { TbMinus } from 'react-icons/tb';
import { styled } from 'shared';

type Props = {
  lineSize: number;
} & IconBaseProps;

const IconStyled = styled(TbMinus, {
  transform: 'rotate(-45deg)',
});

const IconSizeStyle = ({ lineSize, ...restProps }: Props) => {
  return <IconStyled strokeWidth={lineSize} {...restProps} />;
};

export default IconSizeStyle;
