import { renderHook } from '@testing-library/react';
import type { ShapeConfig } from 'konva/lib/Shape';
import type { StageConfig } from 'shared';
import { createNode } from '@/utils/node';
import useNode, { baseConfig } from './useNode';

describe('useNode', () => {
  const node = createNode('arrow', [0, 0]);
  node.style.line = [1, 1];
  node.style.size = 8;

  const stageConfig: StageConfig = {
    position: { x: 0, y: 0 },
    scale: 1.5,
  };

  it('should calculate scaled line correctly', () => {
    const { result } = renderHook(() => useNode(node, stageConfig));

    expect(result.current.scaledLine).toEqual([1.5, 1.5]);
  });

  it('should calculate the total dash length correctly', () => {
    const { result } = renderHook(() => useNode(node, stageConfig));

    expect(result.current.totalDashLength).toEqual(3);
  });

  it('should return computed config correctly', () => {
    const { result } = renderHook(() => useNode(node, stageConfig));

    const expectedConfig: ShapeConfig = {
      ...baseConfig,
      id: node.nodeProps.id,
      visible: node.nodeProps.visible,
      rotation: node.nodeProps.rotation,
      stroke: node.style.color,
      strokeWidth: 12,
      dash: [1.5, 1.5],
      opacity: node.style.opacity,
      listening: node.nodeProps.visible,
    };

    expect(result.current.config).toEqual(expectedConfig);
  });
});