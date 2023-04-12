import { type PropsWithChildren } from 'react';
import { ICON_SIZES } from '@/constants/icon';
import {
  LoaderContainer,
  LoaderInnerContainer,
  LoaderSinner,
} from './LoaderStyled';

type Props = PropsWithChildren<(typeof LoaderContainer)['defaultProps']>;

const Loader = ({ children, ...restProps }: Props) => {
  return (
    <LoaderContainer {...restProps}>
      <LoaderInnerContainer>
        {children}
        <LoaderSinner size={ICON_SIZES.LARGE} />
      </LoaderInnerContainer>
    </LoaderContainer>
  );
};

export default Loader;
