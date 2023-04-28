import {
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useRef,
} from 'react';
import { useClickAway } from '@/hooks/useClickAway';
import useDisclosure from '@/hooks/useDisclosure/useDisclosure';
import Button from '../Button/Button';
import { type ButtonStyled } from '../Button/ButtonStyled';
import { PopoverContext } from './PopoverContext';
import { PopoverDropdown, PopoverContainer } from './PopoverStyled';

export type PopoverToggleProps = PropsWithChildren<
  typeof ButtonStyled.defaultProps
>;

export type PopoverProps = typeof PopoverContainer.defaultProps & {
  initiallyOpened?: boolean;
  closeOnClickAway?: boolean;
  children: ReactNode[] | ReactNode;
};

type DropdownProps = PropsWithChildren<{
  opened?: boolean;
}>;

const Toggle = ({ children, ...props }: PopoverToggleProps) => {
  const ctx = useContext(PopoverContext);

  return (
    <Button {...props} onClick={ctx?.toggle}>
      {children}
    </Button>
  );
};

const Dropdown = ({ opened = false, children }: DropdownProps) => {
  const ctx = useContext(PopoverContext);

  return opened || ctx?.opened ? (
    <PopoverDropdown>{children}</PopoverDropdown>
  ) : null;
};

const Popover = ({
  children,
  initiallyOpened = false,
  closeOnClickAway = true,
  ...restProps
}: PopoverProps) => {
  const [opened, { close, toggle }] = useDisclosure(initiallyOpened);

  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => closeOnClickAway && close());

  return (
    <PopoverContext.Provider value={{ opened, toggle, close }}>
      <PopoverContainer ref={ref} {...restProps}>
        {children}
      </PopoverContainer>
    </PopoverContext.Provider>
  );
};

Popover.Toggle = Toggle;
Popover.Dropdown = Dropdown;

export default Popover;
