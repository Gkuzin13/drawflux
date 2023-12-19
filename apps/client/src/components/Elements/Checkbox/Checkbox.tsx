import Icon from '../Icon/Icon';
import * as Styled from './Checkbox.styled';
import type { ComponentProps } from 'react';

type Props = ComponentProps<(typeof Styled)['Root']>;

const Checkbox = (props: Props) => {
  return (
    <Styled.Root {...props}>
      <Styled.Indicator>
        <Icon name="check" />
      </Styled.Indicator>
    </Styled.Root>
  );
};

export default Checkbox;
