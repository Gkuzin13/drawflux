import type { PropsWithChildren, ReactNode } from 'react';
import * as Styled from './Kbd.styled';

type Props = PropsWithChildren<{
  children: ReactNode;
}>;

const Kbd = ({ children }: Props) => {
  return <Styled.Root>{children}</Styled.Root>;
};

export default Kbd;
