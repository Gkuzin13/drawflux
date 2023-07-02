import type { PropsWithChildren } from 'react';
import { ICON_SIZES } from '@/constants/icon';
import * as Styled from './Loader.styled';

type Props = PropsWithChildren<(typeof Styled.Container)['defaultProps']>;

const Loader = ({ children, ...restProps }: Props) => {
  return (
    <Styled.Container {...restProps}>
      <Styled.InnerContainer>
        {children}
        <Styled.Spinner size={ICON_SIZES.MEDIUM} />
      </Styled.InnerContainer>
    </Styled.Container>
  );
};

export default Loader;
