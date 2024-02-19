import { memo } from 'react';
import { Line } from 'react-konva';
import { defaultTheme, type StageConfig } from 'shared';
import type { SnapLineGuide } from '../DrawingCanvas/helpers/snap';

type Props = {
  lineGuide: SnapLineGuide;
  stageConfig: StageConfig;
};

const getConfig = (
  lineGuide: SnapLineGuide,
  stagePosition: StageConfig['position'],
  stageScale: number,
) => {
  const baseConfig = {
    dash: [4 / stageScale, 6 / stageScale],
    strokeWidth: 1 / stageScale,
  };

  if (lineGuide.orientation === 'horizontal') {
    return {
      ...baseConfig,
      x: 0,
      y: (lineGuide.guide - stagePosition.y) / stageScale,
      points: [
        -stagePosition.x / stageScale,
        0,
        (-stagePosition.x + window.innerWidth) / stageScale,
        0,
      ],
    };
  }

  return {
    ...baseConfig,
    x: (lineGuide.guide - stagePosition.x) / stageScale,
    y: 0,
    points: [
      0,
      -stagePosition.y / stageScale,
      0,
      (-stagePosition.y + window.innerHeight) / stageScale,
    ],
  };
};

const LineGuide = ({ lineGuide, stageConfig }: Props) => {
  const config = getConfig(lineGuide, stageConfig.position, stageConfig.scale);

  return (
    <Line
      stroke={defaultTheme.colors.green400.value}
      opacity={0.7}
      {...config}
      name={`${lineGuide.orientation}-line-guide`}
    />
  );
};

export default memo(LineGuide);
