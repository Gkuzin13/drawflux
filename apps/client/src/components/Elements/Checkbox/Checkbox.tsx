import Icon from '../Icon/Icon';
import * as Styled from './Checkbox.styled';
import type { ComponentProps } from 'react';
import { getIconProps } from './getIconProps';

type Props = ComponentProps<(typeof Styled)['Root']>;

const Checkbox = (props: Props) => {
  const iconProps = getIconProps(props.size);

  return (
    <Styled.Root {...props}>
      <Styled.Indicator>
        <Icon name="check" {...iconProps} />
      </Styled.Indicator>
    </Styled.Root>
  );
};

export default Checkbox;
