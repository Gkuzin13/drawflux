import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as PanelStyled from '@/components/Panels/StylePanel/StylePanel.styled';
import { ICON_SIZES } from '@/constants/icon';
import { COLOR } from '@/constants/panels/style';
import { getColorValue } from '@/utils/shape';
import * as Styled from './ColorsGridStyled';

type Props = {
  value: string;
  withLabel?: boolean;
  onSelect: (color: (typeof COLOR)[number]['value']) => void;
};

const ColorsGrid = ({ withLabel = false, value, onSelect }: Props) => {
  return (
    <RadioGroupPrimitive.Root
      defaultValue={value}
      aria-label="Color"
      aria-labelledby="shape-color"
      orientation="horizontal"
      value={value}
      onValueChange={onSelect}
    >
      {withLabel && (
        <PanelStyled.Label htmlFor="shape-color" css={{ fontSize: '$1' }}>
          Color
        </PanelStyled.Label>
      )}
      <Styled.Grid>
        {COLOR.map((color) => {
          return (
            <Styled.Color
              key={color.value}
              checked={color.value === value}
              value={color.value}
              aria-label={`${color.name} color`}
              title={color.name}
              color={color.value === value ? 'secondary' : 'secondary-light'}
              style={{ color: getColorValue(color.value) }}
            >
              {color.icon({ size: ICON_SIZES.LARGE })}
            </Styled.Color>
          );
        })}
      </Styled.Grid>
    </RadioGroupPrimitive.Root>
  );
};

export default ColorsGrid;
