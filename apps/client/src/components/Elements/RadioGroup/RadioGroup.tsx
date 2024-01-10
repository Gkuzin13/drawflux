import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

type RadioGroupProps = RadioGroupPrimitive.RadioGroupProps;

const RadioGroup = ({ children, ...props }: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive.Root {...props}>{children}</RadioGroupPrimitive.Root>
  );
};

RadioGroup.Item = RadioGroupPrimitive.Item;

export default RadioGroup;
