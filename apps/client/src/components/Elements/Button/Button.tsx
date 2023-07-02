import type { PropsWithChildren } from 'react';
import * as Styled from './Button.styled';

type Props = typeof Styled.Button.defaultProps & PropsWithChildren;

const Button = ({ children, type = 'button', ...props }: Props) => {
  return (
    <Styled.Button type={type} {...props}>
      {children}
    </Styled.Button>
  );
};

export default Button;
