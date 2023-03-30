import { createNode } from '../node';

describe('createNode', () => {
  it('should create node correctly', () => {
    const createdNode = createNode('arrow', [180, 100]);

    expect(createdNode.type).toBe('arrow');
    expect(createdNode.nodeProps.point).toEqual([180, 100]);
  });
});
