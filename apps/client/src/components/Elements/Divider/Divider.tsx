import * as Styled from './Divider.styled';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Styled.Root>;

const Divider = (props: Props) => {
  return <Styled.Root {...props} />;
};

export default Divider;
