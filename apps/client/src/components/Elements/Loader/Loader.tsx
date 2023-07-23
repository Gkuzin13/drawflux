import type { PropsWithChildren } from 'react';
import * as Styled from './Loader.styled';

type Props = PropsWithChildren<(typeof Styled.Container)['defaultProps']>;

const Loader = ({ children, ...restProps }: Props) => {
  return (
    <Styled.Container {...restProps}>
      <Styled.InnerContainer>
        {children}
        <Styled.Spinner name="spinner" size="md" />
      </Styled.InnerContainer>
    </Styled.Container>
  );
};

export default Loader;
