import * as PopoverPrimitive from '@radix-ui/react-popover';
import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';

export const Content = styled(PopoverPrimitive.Content, {
  padding: '$2',
  display: 'flex',
  gap: '$2',
  flexDirection: 'column',
  boxShadow: '$sm',
  maxWidth: '$11',
  borderRadius: '$2',
  marginTop: '$2',
  backgroundColor: '$bg',
});

export const Info = styled('p', {
  padding: '0 $1 $1 $1',
  fontSize: '$1',
  color: '$gray500',
});

export const Trigger = styled(PopoverPrimitive.Trigger, ButtonStyled.Button, {
  defaultVariants: {
    color: 'primary',
    size: 'sm',
  },
});

export const QRCodeContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '1 / 1',
});
