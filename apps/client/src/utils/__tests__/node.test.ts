import { nodesGenerator } from '@/test/data-generators';
import {
  createNode,
  duplicateNodes,
  getAddedNodes,
  reorderNodes,
} from '../node';

describe('createNode', () => {
  it('should create a node object correctly', () => {
    const node = createNode('ellipse', [180, 100]);
    node.style.fill = 'solid';

    expect(node.type).toBe('ellipse');
    expect(node.nodeProps.point).toEqual([180, 100]);
    expect(node.text).toBeNull();
    expect(node.style.opacity).toBe(1);
    expect(node.style.line).toBe('solid');
    expect(node.style.color).toBe('black');
    expect(node.style.fill).toBe('solid');
    expect(node.style.size).toBe('medium');
    expect(node.style.animated).toBe(false);
    expect(node.nodeProps.id).toBeTruthy();
    expect(node.nodeProps.rotation).toBe(0);
    expect(node.nodeProps.visible).toBe(true);
  });
});

describe('reorderNodes', () => {
  const nodes = nodesGenerator(5).map((node, index) => {
    return { ...node, nodeProps: { ...node.nodeProps, id: `${index + 1}` } };
  });

  it('should return the nodes in the correct order when moving nodes to the start', () => {
    const idsToReorder = ['3', '5'];
    const reorderedNodes = reorderNodes(idsToReorder, nodes).toStart();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([
      '5',
      '3',
      '1',
      '2',
      '4',
    ]);
  });

  it('should return the nodes in the correct order when moving nodes to the end', () => {
    const idsToReorder = ['2', '4'];
    const reorderedNodes = reorderNodes(idsToReorder, nodes).toEnd();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([
      '1',
      '3',
      '5',
      '2',
      '4',
    ]);
  });

  it('should return the nodes in the correct order when moving nodes forward', () => {
    const idsToReorder = ['2', '4'];
    const reorderedNodes = reorderNodes(idsToReorder, nodes).forward();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([
      '1',
      '3',
      '2',
      '5',
      '4',
    ]);
  });

  it('should return the nodes in the correct order when moving nodes backward', () => {
    const idsToReorder = ['3', '5'];
    const reorderedNodes = reorderNodes(idsToReorder, nodes).backward();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([
      '1',
      '3',
      '2',
      '5',
      '4',
    ]);
  });

  it('should return correctly if only a single node is in the array', () => {
    const idsToReorder = ['1'];
    const reorderedNodes = reorderNodes(
      idsToReorder,
      nodes.slice(0, 1),
    ).toStart();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual(['1']);
  });

  it('should return correctly if duplicate ids exist', () => {
    const idsToReorder = ['1', '1'];
    const reorderedNodes = reorderNodes(
      idsToReorder,
      nodes.map((node) => {
        return { ...node, nodeProps: { ...node.nodeProps, id: '1' } };
      }),
    ).toStart();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([
      '1',
      '1',
      '1',
      '1',
      '1',
    ]);
  });

  it('should return empty array if nodes array is empty', () => {
    const idsToReorder = ['1'];
    const reorderedNodes = reorderNodes(idsToReorder, []).toStart();

    expect(reorderedNodes.map((node) => node.nodeProps.id)).toEqual([]);
  });
});

describe('duplicateNodes', () => {
  it('should duplicate nodes correctly', () => {
    const nodes = nodesGenerator(5);
    const duplicatedNodes = duplicateNodes(nodes);

    expect(duplicatedNodes).toHaveLength(nodes.length);

    duplicatedNodes.forEach((node, index) => {
      expect(node.nodeProps.id).not.toBe(nodes[index].nodeProps.id);
      expect(node.nodeProps.point).not.toEqual(nodes[index].nodeProps.point);
    });
  });
});

describe('getAddedNodes', () => {
  it('should return added nodes correctly', () => {
    const nodes = nodesGenerator(5);
    const nodesToAdd = nodesGenerator(4);

    const addedNodes = getAddedNodes(
      [...nodes, ...nodesToAdd],
      nodesToAdd.length,
    );

    expect(addedNodes).toEqual(nodesToAdd);
  });

  it('should return empty array if no nodes are added', () => {
    const nodes = nodesGenerator(5);
    const addedNodes = getAddedNodes(nodes, 0);

    expect(addedNodes).toEqual([]);
  });

  it('should return empty array if no nodes are passed', () => {
    const addedNodes = getAddedNodes([], 0);

    expect(addedNodes).toEqual([]);
  });

  it('should return passed nodes if addedCount is more than nodes count', () => {
    const nodes = nodesGenerator(5);
    const nodesToAdd = nodesGenerator(6);
    const allNodes = [...nodes, ...nodesToAdd];

    const addedNodes = getAddedNodes(allNodes, allNodes.length + 1);

    expect(addedNodes).toEqual(allNodes);
  });
});
