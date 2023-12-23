import * as Styled from './Text.styled';
import type { ThemeColorKey } from 'shared';
import type { ComponentProps } from '@stitches/react';

export type TextComponentType = 'p' | 'span';

type Props = {
  color?: ThemeColorKey;
  as?: TextComponentType;
  children?: React.ReactNode;
} & ComponentProps<ReturnType<(typeof Styled)['Root']>>;

const Text = ({
  as = 'span',
  color = 'black',
  children,
  ...restProps
}: Props) => {
  const Component = Styled.Root(as, color);

  return <Component {...restProps}>{children}</Component>;
};

export default Text;
