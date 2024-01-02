import { TbLetterL, TbLetterX } from 'react-icons/tb';
import * as Styled from './ExtraLarge.styled';
import type { IconBaseProps } from 'react-icons';

const ExtraLarge = (props: IconBaseProps) => {
  return (
    <Styled.Root>
      <TbLetterX {...props} name="letterX" />
      <TbLetterL {...props} name="letterL" />
    </Styled.Root>
  );
};

export default ExtraLarge;
