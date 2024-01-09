import { createTitle } from '@/utils/string';
import ColorCircle from '../ColorCircle/ColorCircle';
import RadioGroup from '../RadioGroup/RadioGroup';
import * as PanelStyled from '@/components/Panels/StylePanel/StylePanel.styled';
import * as Styled from './ColorsGrid.styled';
import type { NodeColor } from 'shared';

type Props = {
  value: string;
  withLabel?: boolean;
  onSelect: (color: (typeof COLOR)[number]['value']) => void;
};

const COLOR: { name: string; value: NodeColor }[] = [
  { name: 'Red', value: 'red600' },
  { name: 'Pink', value: 'pink600' },
  { name: 'Deep Orange', value: 'deep-orange600' },
  { name: 'Yellow', value: 'yellow600' },
  { name: 'Green', value: 'green600' },
  { name: 'Teal', value: 'teal600' },
  { name: 'Light Blue', value: 'light-blue600' },
  { name: 'Blue', value: 'blue600' },
  { name: 'Deep Purple', value: 'deep-purple600' },
  { name: 'Indigo', value: 'indigo600' },
  { name: 'Black', value: 'black' },
  { name: 'Gray', value: 'gray600' },
];

const ColorsGrid = ({ withLabel = false, value, onSelect }: Props) => {
  return (
    <RadioGroup
      defaultValue={value}
      aria-label="Colors"
      aria-labelledby="colors"
      orientation="horizontal"
      value={value}
      onValueChange={onSelect}
    >
      {withLabel && <PanelStyled.Label>Color</PanelStyled.Label>}
      <Styled.Grid>
        {COLOR.map((color) => {
          return (
            <Styled.Color
              key={color.value}
              checked={color.value === value}
              value={color.value}
              aria-label={`${color.name} color`}
              title={createTitle('Color', color.name)}
              color={
                color.value === value ? 'secondary-dark' : 'secondary-light'
              }
              style={{ color: `var(--colors-${color.value})` }}
            >
              <ColorCircle />
            </Styled.Color>
          );
        })}
      </Styled.Grid>
    </RadioGroup>
  );
};

export default ColorsGrid;
