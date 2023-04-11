import { PropsWithChildren } from 'react';
import {
  LoaderContainer,
  LoaderInnerContainer,
  LoaderSinner,
} from './LoaderStyled';
import { ICON_SIZES } from '@/constants/icon';

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
