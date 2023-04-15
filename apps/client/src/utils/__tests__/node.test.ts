import { colors } from 'shared';
import { LINE, SIZE } from '@/constants/style';
import { createNode } from '../node';

describe('createNode', () => {
  it('should create a node object correctly', () => {
    const node = createNode('arrow', [180, 100]);

    expect(node.type).toBe('arrow');
    expect(node.nodeProps.point).toEqual([180, 100]);
    expect(node.text).toBeNull();
    expect(node.style.line).toBe(LINE[0].value);
    expect(node.style.color).toBe(colors.black);
    expect(node.style.size).toBe(SIZE[1].value);
    expect(node.style.animated).toBe(false);
    expect(node.nodeProps.id).toMatch(/^node-\d+$/);
    expect(node.nodeProps.rotation).toBe(0);
    expect(node.nodeProps.visible).toBe(true);
  });
});
