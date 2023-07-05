import { useMemo } from 'react';
import type {
  NodeColor,
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

export type StylePanelProps = {
  selectedNodes: NodeObject[];
  onStyleChange: (
    updatedStyle: Partial<NodeStyle>,
    updateAsync?: boolean,
  ) => void;
};

const StylePanel = ({ selectedNodes, onStyleChange }: StylePanelProps) => {
  const style = useMemo(() => {
    const styles: NodeStyle[] = selectedNodes.map(({ style }) => style);

    const colors = new Set(styles.map(({ color }) => color));
    const lines = new Set(styles.map(({ line }) => line));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const allShapesAnimated = styles.every(({ animated }) => animated);

    const getValueIfAllIdentical = <T extends string | number | boolean>(
      set: Set<T>,
    ): T | undefined => {
      return set.size === 1 ? [...set][0] : undefined;
    };

    return {
      color: getValueIfAllIdentical(colors),
      line: getValueIfAllIdentical(lines),
      size: getValueIfAllIdentical(sizes),
      opacity: getValueIfAllIdentical(opacities),
      animated: allShapesAnimated,
    };
  }, [selectedNodes]);

  const enabledOptions = useMemo(() => {
    const selectedNodesTypes = selectedNodes.map(({ type }) => type);

    if (selectedNodesTypes.includes('text')) {
      return { line: false, size: true };
    }

    return { line: true, size: true };
  }, [selectedNodes]);

  const isActive = selectedNodes.length > 0;

  const handleColorSelect = (color: NodeColor) => {
    onStyleChange({ color });
  };

  const handleLineSelect = (value: NodeLine) => {
    onStyleChange({
      animated: style.animated && value !== 'solid' ? true : false,
      line: value,
    });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !style.animated });
  };

  const handleSizeSelect = (size: NodeSize) => {
    onStyleChange({ size });
  };

  const handleOpacitySelect = (value: number, commit = false) => {
    const clampedOpacity = clamp(value, OPACITY.minValue, OPACITY.maxValue);
    onStyleChange({ opacity: clampedOpacity }, commit);
  };

  const handleOpacityChange = (value: number) => {
    handleOpacitySelect(value);
  };

  const handleOpacityCommit = (value: number) => {
    handleOpacitySelect(value, true);
  };

  return (
    <Styled.Container active={isActive}>
      <ColorSection value={style.color} onColorChange={handleColorSelect} />
      <OpacitySection
        value={style.opacity}
        onValueChange={handleOpacityChange}
        onValueCommit={handleOpacityCommit}
      />
      {enabledOptions.line && (
        <>
          <LineSection value={style.line} onLineChange={handleLineSelect} />
          <AnimatedSection
            value={style.animated}
            isDisabled={style.line === 'solid'}
            onAnimatedChange={handleAnimatedSelect}
          />
        </>
      )}
      {enabledOptions.size && (
        <SizeSection value={style.size} onSizeChange={handleSizeSelect} />
      )}
    </Styled.Container>
  );
};

export default StylePanel;
