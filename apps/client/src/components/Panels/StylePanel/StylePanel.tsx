import { useMemo } from 'react';
import { OPACITY } from '@/constants/panels';
import { clamp } from '@/utils/math';
import AnimatedSection from './AnimatedSection';
import ColorSection from './ColorSection';
import LineSection from './LineSection';
import OpacitySection from './OpacitySection';
import ArrowHeadsSection from './ArrowHeadsSection';
import FillSection from './FillSection';
import SizeSection from './SizeSection';
import * as Styled from './StylePanel.styled';
import type {
  ArrowHeadDirection,
  NodeColor,
  NodeFill,
  NodeLine,
  NodeObject,
  NodeSize,
  NodeStyle,
} from 'shared';
import type { ArrowHead } from './ArrowHeadsSection';

type Props = {
  selectedNodes: NodeObject[];
  onStyleChange: (style: Partial<NodeStyle>) => void;
};

const getValueIfAllIdentical = <
  T extends string | number | boolean | undefined,
>(
  set: Set<T>,
): T | undefined => {
  return set.size === 1 ? [...set][0] : undefined;
};

const StylePanel = ({ selectedNodes, onStyleChange }: Props) => {
  const mergedStyle = useMemo((): Partial<NodeStyle> => {
    const styles: NodeStyle[] = selectedNodes.map(({ style }) => style);

    const colors = new Set(styles.map(({ color }) => color));
    const lines = new Set(styles.map(({ line }) => line));
    const fills = new Set(styles.map(({ fill }) => fill));
    const sizes = new Set(styles.map(({ size }) => size));
    const opacities = new Set(styles.map(({ opacity }) => opacity));
    const allShapesAnimated = styles.every(({ animated }) => animated);
    const arrowStartHeads = new Set(
      styles.map((style) => style.arrowStartHead),
    );
    const arrowEndHeads = new Set(styles.map((style) => style.arrowEndHead));

    return {
      color: getValueIfAllIdentical(colors),
      line: getValueIfAllIdentical(lines),
      fill: getValueIfAllIdentical(fills),
      size: getValueIfAllIdentical(sizes),
      opacity: getValueIfAllIdentical(opacities),
      arrowStartHead: getValueIfAllIdentical(arrowStartHeads),
      arrowEndHead: getValueIfAllIdentical(arrowEndHeads),
      animated: allShapesAnimated,
    };
  }, [selectedNodes]);

  const enabledOptions = useMemo(() => {
    const selectedNodesTypes = selectedNodes.map(({ type }) => type);

    const onlyTextNodes = selectedNodesTypes.every((type) => type === 'text');

    if (onlyTextNodes) {
      return { line: false, size: true };
    }

    const hasArrowNodes = selectedNodesTypes.some((type) => type === 'arrow');

    return { line: true, size: true, arrowHeads: hasArrowNodes };
  }, [selectedNodes]);

  const fillSectionValue = useMemo(() => {
    if (selectedNodes.length > 1) {
      return mergedStyle.fill;
    }

    return mergedStyle.fill ?? 'none';
  }, [mergedStyle.fill, selectedNodes.length]);

  const handleColorSelect = (color: NodeColor) => {
    onStyleChange({ color });
  };

  const handleLineSelect = (value: NodeLine) => {
    onStyleChange({ line: value });
  };

  const handleAnimatedSelect = () => {
    onStyleChange({ animated: !mergedStyle.animated });
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

  const handleArrowHeadChange = (
    direction: ArrowHeadDirection,
    value: ArrowHead,
  ) => {
    if (direction === 'start') {
      onStyleChange({ arrowStartHead: value });
    } else {
      onStyleChange({ arrowEndHead: value });
    }
  };

  return (
    <Styled.Container data-testid="style-panel">
      <ColorSection
        value={mergedStyle.color}
        onColorChange={handleColorSelect}
      />
      {enabledOptions.arrowHeads && (
        <ArrowHeadsSection
          startHead={mergedStyle.arrowStartHead}
          endHead={mergedStyle.arrowEndHead}
          onArrowHeadChange={handleArrowHeadChange}
        />
      )}
      <OpacitySection
        value={mergedStyle.opacity}
        onValueChange={handleOpacityChange}
        onValueCommit={handleOpacityCommit}
      />
      {enabledOptions.size && (
        <SizeSection value={mergedStyle.size} onSizeChange={handleSizeSelect} />
      )}
      <FillSection value={fillSectionValue} onFillChange={handleFillChange} />
      {enabledOptions.line && (
        <>
          <LineSection
            value={mergedStyle.line}
            onLineChange={handleLineSelect}
          />
          <AnimatedSection
            value={mergedStyle.animated && mergedStyle.line !== 'solid'}
            isDisabled={mergedStyle.line === 'solid'}
            onAnimatedChange={handleAnimatedSelect}
          />
        </>
      )}
    </Styled.Container>
  );
};

export default StylePanel;
