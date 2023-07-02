import type { SeparatorProps } from '@radix-ui/react-separator';
import * as Styled from './Divider.styled';

const Divider = (props: SeparatorProps) => {
  return <Styled.Root {...props} />;
};

export default Divider;
