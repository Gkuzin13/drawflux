import { type PropsWithChildren } from 'react';
import { ButtonStyled } from './ButtonStyled';

type Props = typeof ButtonStyled.defaultProps & PropsWithChildren;

const Button = ({ children, type = 'button', ...props }: Props) => {
  return (
    <ButtonStyled type={type} {...props}>
      {children}
    </ButtonStyled>
  );
};

export default Button;
