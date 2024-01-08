import { useMemo } from 'react';
import type {
  NodeColor,
  NodeFill,
  NodeLine,
  NodeObject,
  NodeSize,
  NodeStyle,
} from 'shared';
import { OPACITY } from '@/constants/panels/style';
import { clamp } from '@/utils/math';
import AnimatedSection from './AnimatedSection';
import ColorSection from './ColorSection';
import LineSection from './LineSection';
import OpacitySection from './OpacitySection';
import SizeSection from './SizeSection';
import * as Styled from './StylePanel.styled';
import FillSection from './FillSection';

export type StylePanelProps = {
  selectedNodes: NodeObject[];
  onStyleChange: (updatedStyle: Partial<NodeStyle>) => void;
};

const StylePanel = ({ selectedNodes, onStyleChange }: StylePanelProps) => {
  const style = useMemo(() => {
    const styles: NodeStyle[] = selectedNodes.map(({ style }) => style);

    const colors = new Set(styles.map(({ color }) => color));
    const lines = new Set(styles.map(({ line }) => line));
    const fills = new Set(styles.map(({ fill }) => fill));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const allShapesAnimated = styles.every(({ animated }) => animated);

    const getValueIfAllIdentical = <
      T extends string | number | boolean | undefined,
    >(
      set: Set<T>,
    ): T | undefined => {
      return set.size === 1 ? [...set][0] : undefined;
    };

    return {
      color: getValueIfAllIdentical(colors),
      line: getValueIfAllIdentical(lines),
      fill: getValueIfAllIdentical(fills),
      size: getValueIfAllIdentical(sizes),
      opacity: getValueIfAllIdentical(opacities),
      animated: allShapesAnimated,
    };
  }, [selectedNodes]);

  const enabledOptions = useMemo(() => {
    const selectedNodesTypes = selectedNodes.map(({ type }) => type);

    const onlyTextNodes = selectedNodesTypes.every((type) => type === 'text');

    if (onlyTextNodes) {
      return { line: false, size: true };
    }

    return { line: true, size: true };
  }, [selectedNodes]);

  const fillSectionValue = useMemo(() => {
    if (selectedNodes.length > 1) {
      return style.fill;
    }

    return style.fill ?? 'none';
  }, [style.fill, selectedNodes.length]);

  const handleColorSelect = (color: NodeColor) => {
    onStyleChange({ color });
  };

  const handleLineSelect = (value: NodeLine) => {
    onStyleChange({ line: value });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !style.animated });
  };

  const handleSizeSelect = (size: NodeSize) => {
    onStyleChange({ size });
  };

  const handleOpacitySelect = (value: number) => {
    const clampedOpacity = clamp(value, [OPACITY.minValue, OPACITY.maxValue]);
    onStyleChange({ opacity: clampedOpacity });
  };

  const handleOpacityChange = (value: number) => {
    handleOpacitySelect(value);
  };

  const handleOpacityCommit = (value: number) => {
    handleOpacitySelect(value);
  };

  const handleFillChange = (value: NodeFill) => {
    onStyleChange({ fill: value });
  };

  return (
    <Styled.Container>
      <ColorSection value={style.color} onColorChange={handleColorSelect} />
      <OpacitySection
        value={style.opacity}
        onValueChange={handleOpacityChange}
        onValueCommit={handleOpacityCommit}
      />
      {enabledOptions.size && (
        <SizeSection value={style.size} onSizeChange={handleSizeSelect} />
      )}
      <FillSection value={fillSectionValue} onFillChange={handleFillChange} />
      {enabledOptions.line && (
        <>
          <LineSection value={style.line} onLineChange={handleLineSelect} />
          <AnimatedSection
            value={style.animated && style.line !== 'solid'}
            isDisabled={style.line === 'solid'}
            onAnimatedChange={handleAnimatedSelect}
          />
        </>
      )}
    </Styled.Container>
  );
};

export default StylePanel;
