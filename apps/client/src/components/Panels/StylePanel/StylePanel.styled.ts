import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { styled } from 'shared';
import * as PanelStyled from '../Panels.styled';
import { Button } from '@/components/Elements/Button/Button.styled';

export const Container = styled(PanelStyled.Panel, {
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

export const Label = styled('span', {
  fontSize: '$1',
  display: 'inline-block',
  paddingBottom: '$1',
  color: '$black',
  opacity: 0.7,
});

export const Toggle = styled(TogglePrimitive.Root, Button, {
  defaultVariants: {
    size: 'xs',
    squared: true,
  },
});

export const Item = styled(RadioGroupPrimitive.Item, Button, {
  defaultVariants: {
    squared: true,
    size: 'xs',
  },
});
