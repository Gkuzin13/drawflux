import * as RadioGroup from '@radix-ui/react-radio-group';
import { ICON_SIZES } from '@/constants/icon';
import { COLOR } from '@/constants/style';
import { getColorValue } from '@/utils/shape';
import { StyleLabel } from '../Panels/StylePanel/StylePanelStyled';
import { ColorButton, ContentGrid } from './ColorsGridStyled';

type Props = {
  value: string;
  withLabel?: boolean;
  onSelect: (color: (typeof COLOR)[number]['value']) => void;
};

const ColorsGrid = ({ withLabel = false, value, onSelect }: Props) => {
  return (
    <RadioGroup.Root
      defaultValue={value}
      aria-label="Color"
      aria-labelledby="shape-color"
      orientation="horizontal"
      value={value}
      onValueChange={onSelect}
    >
      {withLabel && (
        <StyleLabel htmlFor="shape-color" css={{ fontSize: '$1' }}>
          Color
        </StyleLabel>
      )}
      <ContentGrid>
        {COLOR.map((color) => {
          return (
            <ColorButton
              key={color.value}
              checked={color.value === value}
              value={color.value}
              aria-label={`${color.name} color`}
              title={color.name}
              color={color.value === value ? 'secondary' : 'secondary-light'}
              style={{ color: getColorValue(color.value) }}
            >
              {color.icon({ size: ICON_SIZES.LARGE })}
            </ColorButton>
          );
        })}
      </ContentGrid>
    </RadioGroup.Root>
  );
};

export default ColorsGrid;
