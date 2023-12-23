import { renderHook } from '@testing-library/react';
import { defaultTheme, type StageConfig } from 'shared';
import { createNode } from '@/utils/node';
import { getColorValue, getFillValue, getSizeValue } from '@/utils/shape';
import useNode, { baseConfig } from './useNode';
import { ThemeProvider } from '@/contexts/theme';
import type { ShapeConfig } from 'konva/lib/Shape';

describe('useNode', () => {
  const node = createNode('rectangle', [0, 0]);
  node.style.size = 'extra-large';
  node.style.fill = 'solid';

  const stageConfig: StageConfig = {
    position: { x: 0, y: 0 },
    scale: 1,
  };

  it('should return computed config correctly', () => {
    const { result } = renderHook(() => useNode(node, stageConfig.scale), {
      wrapper: ThemeProvider,
    });

    const color = getColorValue(node.style.color, defaultTheme.colors);
    const size = getSizeValue(node.style.size);
    const fill = getFillValue(node.style.fill, color);

    const expectedConfig: ShapeConfig = {
      ...baseConfig,
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: color,
      strokeWidth: size,
      fill,
      dash: [],
      fillEnabled: true,
      opacity: node.style.opacity,
      listening: node.nodeProps.visible,
    };

    expect(result.current.config).toEqual(expectedConfig);
  });
});
