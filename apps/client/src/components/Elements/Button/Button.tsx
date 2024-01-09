import { forwardRef } from 'react';
import * as Styled from './Button.styled';

type Props = typeof Styled.Button.defaultProps & React.PropsWithChildren;

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, type = 'button', ...props }, ref) => {
    return (
      <Styled.Button type={type} {...props} ref={ref}>
        {children}
      </Styled.Button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
