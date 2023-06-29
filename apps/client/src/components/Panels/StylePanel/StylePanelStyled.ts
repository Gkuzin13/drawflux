import { Root as LabelRoot } from '@radix-ui/react-label';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Toggle from '@radix-ui/react-toggle';
import { styled } from 'shared';
import { ButtonStyled } from '@/components/Elements/Button/ButtonStyled';
import { Panel } from '../PanelsStyled';

export const StyleContainer = styled(Panel, {
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

export const StyleRadioGroup = styled(RadioGroup.Root, {
  display: 'flex',
  flexDirection: 'column',
});

export const StyleGrid = styled('div', {
  display: 'grid',
  placeItems: 'center',
  gridTemplateColumns: '$5 $5 $5 $5',
  gap: '$1',
});

export const StyleLabel = styled(LabelRoot, {
  display: 'inline-block',
  paddingBottom: '$1',
  color: '$gray700',
});

export const ToggleButton = styled(Toggle.Root, ButtonStyled, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});

export const StyleButton = styled(RadioGroup.Item, ButtonStyled, {
  defaultVariants: {
    size: 'extra-small',
    color: 'secondary',
    squared: true,
  },
});
