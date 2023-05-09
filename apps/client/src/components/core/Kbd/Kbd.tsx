import type { PropsWithChildren, ReactNode } from 'react';
import { KbdStyled } from './KbdStyled';

type Props = PropsWithChildren<{
  children: ReactNode;
}>;

const Kbd = ({ children }: Props) => {
  return <KbdStyled>{children}</KbdStyled>;
};

export default Kbd;
