import type { PropsWithChildren } from 'react';
import { ICON_SIZES } from '@/constants/icon';
import {
  LoaderContainer,
  LoaderInnerContainer,
  LoaderSpinner,
} from './LoaderStyled';

type Props = PropsWithChildren<(typeof LoaderContainer)['defaultProps']>;

const Loader = ({ children, ...restProps }: Props) => {
  return (
    <LoaderContainer {...restProps}>
      <LoaderInnerContainer>
        {children}
        <LoaderSpinner size={ICON_SIZES.MEDIUM} />
      </LoaderInnerContainer>
    </LoaderContainer>
  );
};

export default Loader;
