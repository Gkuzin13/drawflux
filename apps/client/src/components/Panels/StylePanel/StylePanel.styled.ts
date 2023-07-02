import * as LabelPrimitive from '@radix-ui/react-label';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { styled } from 'shared';
import * as ButtonStyled from '@/components/Elements/Button/Button.styled';
import { Panel } from '../Panels.styled';

export const Container = styled(Panel, {
  position: 'absolute',
  top: '100%',
  marginTop: '$2',
  flexDirection: 'column',
  padding: '$2',
  gap: '$3',
  display: 'none',
  variants: {
    active: {
      true: {
        display: 'flex',
      },
    },
  },
});

export const InnerContainer = styled(RadioGroupPrimitive.Root, {
  display: 'flex',
  flexDirection: 'column',
});

export const Grid = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: '$5 $5 $5 $5',
  gap: '$1',
});

export const Label = styled(LabelPrimitive.Root, {
  display: 'inline-block',
  paddingBottom: '$1',
  color: '$gray700',
});

export const Toggle = styled(TogglePrimitive.Root, ButtonStyled.Button, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});

export const Item = styled(RadioGroupPrimitive.Item, ButtonStyled.Button, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});
