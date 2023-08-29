import { forwardRef, type ComponentProps } from 'react';
import * as Styled from './Switch.styled';
import type { IconName } from '../Icon/Icon';
import Icon from '../Icon/Icon';

export type SwitchProps = {
  label: string;
  checked: boolean;
  icon?: IconName;
  onCheckedChange: (checked: boolean) => void;
} & ComponentProps<(typeof Styled)['Root']>;

const Switch = forwardRef<HTMLDivElement, SwitchProps>(
  ({ checked, onCheckedChange, icon, label, id, ...props }, ref) => {
    return (
      <Styled.Container ref={ref}>
        {icon && <Icon name={icon} />}
        <Styled.Label htmlFor={id}>{label}</Styled.Label>
        <Styled.Root
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          {...props}
        >
          <Styled.Thumb />
        </Styled.Root>
      </Styled.Container>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
