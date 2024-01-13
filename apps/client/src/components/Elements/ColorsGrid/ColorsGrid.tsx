import { createTitle } from '@/utils/string';
import ColorCircle from '../ColorCircle/ColorCircle';
import RadioGroup from '../RadioGroup/RadioGroup';
import { GRID_COLORS } from '@/constants/panels';
import * as PanelStyled from '@/components/Panels/StylePanel/StylePanel.styled';
import * as Styled from './ColorsGrid.styled';

type Props = {
  value: string;
  withLabel?: boolean;
  onSelect: (color: (typeof GRID_COLORS)[number]['value']) => void;
};

const ColorsGrid = ({ withLabel = false, value, onSelect }: Props) => {
  return (
    <RadioGroup
      defaultValue={value}
      aria-label="Colors"
      aria-labelledby="colors"
      orientation="horizontal"
      value={value}
      onValueChange={onSelect}
      data-testid="colors-grid"
    >
      {withLabel && <PanelStyled.Label>Color</PanelStyled.Label>}
      <Styled.Grid>
        {GRID_COLORS.map((color) => {
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
              data-testid={`${color.value}-color-button`}
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
