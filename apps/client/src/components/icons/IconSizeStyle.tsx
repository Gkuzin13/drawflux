import { styled } from '@shared';
import { IconBaseProps } from 'react-icons';
import { TbMinus } from 'react-icons/tb';

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
