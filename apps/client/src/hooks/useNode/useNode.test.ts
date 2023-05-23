import { renderHook } from '@testing-library/react';
import type { ShapeConfig } from 'konva/lib/Shape';
import type { StageConfig } from 'shared';
import { createNode } from '@/utils/node';
import { getColorValue, getSizeValue } from '@/utils/shape';
import useNode, { baseConfig } from './useNode';

describe('useNode', () => {
  const node = createNode('arrow', [0, 0]);
  node.style.size = 'extra-large';

  const stageConfig: StageConfig = {
    position: { x: 0, y: 0 },
    scale: 1,
  };

  it('should return computed config correctly', () => {
    const { result } = renderHook(() => useNode(node, stageConfig));

    const expectedConfig: ShapeConfig = {
      ...baseConfig,
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: getColorValue(node.style.color),
      strokeWidth: getSizeValue(node.style.size),
      dash: [],
      opacity: node.style.opacity,
      listening: node.nodeProps.visible,
    };

    expect(result.current.config).toEqual(expectedConfig);
  });
});
