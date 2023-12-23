import { nodesGenerator } from '@/test/data-generators';
import {
  createNode,
  duplicateNodesToRight,
  isValidNode,
  mapNodesIds,
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
    const duplicatedNodes = duplicateNodesToRight(nodes);

    expect(duplicatedNodes).toHaveLength(nodes.length);

    duplicatedNodes.forEach((node, index) => {
      expect(node.nodeProps.id).not.toBe(nodes[index].nodeProps.id);
      expect(node.nodeProps.point).not.toEqual(nodes[index].nodeProps.point);
    });
  });
});

describe('mapNodesIds', () => {
  it('returns array of ids', () => {
    const nodes = nodesGenerator(3);

    expect(mapNodesIds(nodes)).toEqual([
      nodes[0].nodeProps.id,
      nodes[1].nodeProps.id,
      nodes[2].nodeProps.id,
    ]);
  });

  it('returns empty array if nodes are empty', () => {
    expect(mapNodesIds([])).toEqual([]);
  });
});

describe('isValidNode', () => {
  it('returns true if node is valid', () => {
    const node1 = nodesGenerator(1, 'ellipse')[0];
    const node2 = nodesGenerator(1, 'rectangle')[0];

    expect(isValidNode(node1)).toBe(true);
    expect(isValidNode(node2)).toBe(true);
  });

  it('returns false if arrow node is has no points', () => {
    const node = nodesGenerator(1, 'arrow')[0];
    node.nodeProps.points = undefined;

    expect(isValidNode(node)).toBe(false);
  });

  it('returns false if text node text is empty', () => {
    const node = nodesGenerator(1, 'text')[0];
    node.text = '';

    expect(isValidNode(node)).toBe(false);
  });

  it('returns false if draw node has no points', () => {
    const node = nodesGenerator(1, 'draw')[0];
    node.nodeProps.points = undefined;

    expect(isValidNode(node)).toBe(false);
  });
});
