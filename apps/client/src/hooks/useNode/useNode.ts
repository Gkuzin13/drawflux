import { useMemo } from 'react';
import {
  getColorValue,
  getDashStyle,
  getCurrentThemeColors,
  getFillValue,
  getSizeValue,
  getFontSize,
} from '@/utils/shape';
import { useTheme } from '@/contexts/theme';
import { TEXT } from '@/constants/shape';
import type Konva from 'konva';
import type {
  ThemeColorValue,
  NodeObject,
  NodeType,
  ThemeColors,
} from 'shared';

type Config = Konva.NodeConfig &
  Konva.ShapeConfig & { stroke?: ThemeColorValue };

interface BaseStyleConfig extends Config {
  opacity: number;
}

interface TextNodeStyleConfig extends BaseStyleConfig {
  fill: ThemeColorValue;
  fillEnabled: boolean;
  fontSize: number;
  fontFamily: typeof TEXT.FONT_FAMILY;
}

interface LineNodeStyleConfig extends BaseStyleConfig {
  stroke: ThemeColorValue;
  strokeWidth: number;
  dash: number[];
}

interface FillableNodeStyleConfig extends BaseStyleConfig {
  stroke: ThemeColorValue;
  strokeWidth: number;
  dash: number[];
  fill: ThemeColorValue;
  fillEnabled: boolean;
}

function createStyleConfig<T extends NodeType>(
  node: NodeObject<T>,
  stageScale: number,
  themeColors: ThemeColors,
) {
  const baseStyle: BaseStyleConfig = { opacity: node.style.opacity };

  const sizeValue = getSizeValue(node.style.size);
  const colorValue = getColorValue(node.style.color, themeColors);

  if (node.type === 'text') {
    return {
      ...baseStyle,
      fill: colorValue,
      fillEnabled: true,
      fontSize: getFontSize(sizeValue),
      fontFamily: TEXT.FONT_FAMILY,
    } as T extends 'text' ? TextNodeStyleConfig : never;
  }

  if (node.type === 'draw' || node.type === 'arrow' || node.type === 'laser') {
    return {
      ...baseStyle,
      stroke: colorValue,
      strokeWidth: sizeValue * stageScale,
      dash: getDashStyle(node, sizeValue),
    } as T extends 'arrow' | 'draw' | 'laser' ? LineNodeStyleConfig : never;
  }

  return {
    ...baseStyle,
    stroke: colorValue,
    strokeWidth: sizeValue * stageScale,
    fill: getFillValue(node.style.fill, colorValue),
    dash: getDashStyle(node, sizeValue),
    fillEnabled: node.style.fill ? node.style.fill !== 'none' : false,
  } as T extends 'ellipse' | 'rectangle' ? FillableNodeStyleConfig : never;
}

export const baseConfig: Config = {
  lineCap: 'round',
  strokeScaleEnabled: false,
  perfectDrawEnabled: false,
  shadowForStrokeEnabled: false,
  hitStrokeWidth: 12,
  fillEnabled: false,
  draggable: true,
};

function useNode<T extends NodeType>(node: NodeObject<T>, stageScale: number) {
  const theme = useTheme();

  const config = useMemo(() => {
    const isDarkTheme = theme.value === 'dark';
    const themeColors = getCurrentThemeColors({ isDarkTheme });

    const nodePropsConfig = {
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      listening: node.nodeProps.visible,
    };

    const styleConfig = createStyleConfig(node, stageScale, themeColors);

    return { ...baseConfig, ...nodePropsConfig, ...styleConfig };
  }, [node, stageScale, theme]);

  return { config };
}

export default useNode;
