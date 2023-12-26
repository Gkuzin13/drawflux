import Icon from '../Icon';
import * as Styled from './ExtraLarge.styled';
import type { IconProps } from '../Icon';


const ExtraLarge = (props: IconProps) => {
  return (
    <Styled.Root>
      <Icon {...props} name="letterX" size='lg' />
      <Icon {...props} name="letterL" size='lg' />
    </Styled.Root>
  );
};

export default ExtraLarge;
