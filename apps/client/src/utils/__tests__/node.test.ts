import { type NodeObject, colors } from 'shared';
import { LINE, SIZE } from '@/constants/style';
import { nodesGenerator } from '@/test/data-generators';
import { createNode, getNodesMinMaxXEdges, reorderNodes } from '../node';

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

describe('getNodesMinMaxXEdges', () => {
  it('should return min and max x edges correctly for nodes with width value', () => {
    const rectNode = createNode('rectangle', [0, 0]);
    const ellipseNode = createNode('ellipse', [50, 50]);

    const nodes: NodeObject[] = [
      {
        ...rectNode,
        nodeProps: {
          ...rectNode.nodeProps,
          width: 50,
        },
      },
      {
        ...ellipseNode,
        nodeProps: {
          ...ellipseNode.nodeProps,
          width: 25,
        },
      },
    ];

    expect(getNodesMinMaxXEdges(nodes)).toEqual({ min: 0, max: 100 });
  });

  it('should return min and max x edges correctly for nodes with points array', () => {
    const arrowNode = createNode('arrow', [0, 0]);
    const drawNode = createNode('draw', [50, 50]);

    const nodes: NodeObject[] = [
      {
        ...arrowNode,
        nodeProps: {
          ...arrowNode.nodeProps,
          points: [
            [25, 25],
            [50, 50],
          ],
        },
      },
      {
        ...drawNode,
        nodeProps: {
          ...drawNode.nodeProps,
          points: [
            [50, 50],
            [100, 100],
            [150, 150],
            [200, 200],
          ],
        },
      },
    ];

    expect(getNodesMinMaxXEdges(nodes)).toEqual({ min: 25, max: 200 });
  });
});
