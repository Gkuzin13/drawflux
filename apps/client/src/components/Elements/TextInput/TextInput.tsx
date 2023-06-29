import * as Label from '@radix-ui/react-label';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import type { ComponentProps } from '@stitches/react';
import { forwardRef } from 'react';
import { Input, TextInputContainer } from './TextInputStyled';

type Props = ComponentProps<typeof Input> & {
  label: string;
  visuallyHiddenLabel?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, visuallyHiddenLabel = true, ...props }, ref) => {
    return (
      <TextInputContainer>
        {visuallyHiddenLabel ? (
          <VisuallyHidden.Root>
            <Label.Root htmlFor={props.id}>{label}</Label.Root>
          </VisuallyHidden.Root>
        ) : (
          <Label.Root htmlFor={props.id}>{label}</Label.Root>
        )}
        <Input ref={ref} {...props} type="text" />
      </TextInputContainer>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
