import * as LabelPrimitive from '@radix-ui/react-label';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import type { ComponentProps } from '@stitches/react';
import { forwardRef } from 'react';
import * as Styled from './TextInput.styled';

type Props = ComponentProps<typeof Styled.Input> & {
  label: string;
  visuallyHiddenLabel?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, visuallyHiddenLabel = true, ...props }, ref) => {
    return (
      <Styled.Container>
        {visuallyHiddenLabel ? (
          <VisuallyHiddenPrimitive.Root>
            <LabelPrimitive.Root htmlFor={props.id}>
              {label}
            </LabelPrimitive.Root>
          </VisuallyHiddenPrimitive.Root>
        ) : (
          <LabelPrimitive.Root htmlFor={props.id}>{label}</LabelPrimitive.Root>
        )}
        <Styled.Input ref={ref} {...props} type="text" />
      </Styled.Container>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
