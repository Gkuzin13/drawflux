import type { Point } from 'shared';
import { nodesGenerator } from '@/test/data-generators';
import { createNode } from '../node';
import {
  getMiddleNode,
  getNodeRect,
  inRange,
  isNodeFullyInView,
} from '../position';

describe('getMiddleNode', () => {
  const nodes = nodesGenerator(3, 'rectangle').map((node) => ({
    ...node,
    nodeProps: {
      ...node.nodeProps,
      point: node.nodeProps.point.map((point) => point + 50) as Point,
    },
  }));

  it('should return correct position if nodes count is more than 2', () => {
    const middleNode = getMiddleNode(nodes);

    expect(middleNode?.nodeProps.id).toBe(nodes[1].nodeProps.id);
  });

  it('should return first node if nodes count is less than 3', () => {
    const middleNode = getMiddleNode(nodes.slice(0, 1));

    expect(middleNode?.nodeProps.id).toBe(nodes[0].nodeProps.id);
  });

  it('should return null if nodes count is 0', () => {
    const middleNode = getMiddleNode([]);

    expect(middleNode).toBeNull();
  });
});

describe('getNodeRect', () => {
  it('should calculate the rectangle properties for a node without points', () => {
    const node = createNode('rectangle', [30, 40]);
    node.nodeProps.width = 50;
    node.nodeProps.height = 60;

    const rect = getNodeRect(node);

    expect(rect.x).toBe(30);
    expect(rect.y).toBe(40);
    expect(rect.width).toBe(50);
    expect(rect.height).toBe(60);
  });

  it('should calculate rect properties for a node with points', () => {
    const arrowNode = createNode('arrow', [50, 50]);
    arrowNode.nodeProps.points = [[100, 100]];

    const drawNode = createNode('draw', [100, 100]);
    drawNode.nodeProps.points = [
      [150, 150],
      [50, 50],
    ];

    const arrowRect = getNodeRect(arrowNode);

    expect(arrowRect.x).toBe(50);
    expect(arrowRect.y).toBe(50);
    expect(arrowRect.width).toBe(50);
    expect(arrowRect.height).toBe(50);

    const drawRect = getNodeRect(drawNode);

    expect(drawRect.x).toBe(50);
    expect(drawRect.y).toBe(50);
    expect(drawRect.width).toBe(100);
    expect(drawRect.height).toBe(100);
  });

  it('should calculate rect properties for an ellipse node', () => {
    const ellipseNode = createNode('ellipse', [50, 60]);
    ellipseNode.nodeProps.width = 30;
    ellipseNode.nodeProps.height = 20;

    const rect = getNodeRect(ellipseNode);

    expect(rect.x).toBe(20);
    expect(rect.y).toBe(40);
    expect(rect.width).toBe(60);
    expect(rect.height).toBe(40);
  });
});

describe('isNodeFullyInView', () => {
  const stageRect = {
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  };

  it('should return false if node is not fully in view', () => {
    const node = createNode('rectangle', [-50, 50]);

    expect(isNodeFullyInView(node, stageRect, 1)).toBe(false);
  });

  it('should return true if node is fully in view', () => {
    const node = createNode('rectangle', [60, 50]);

    expect(isNodeFullyInView(node, stageRect, 1)).toBe(true);
  });
});

describe('inRange', () => {
  it('returns true if value is in range', () => {
    expect(inRange(5, 1, 10)).toBe(true);
  });

  it('returns false if value is not in range', () => {
    expect(inRange(15, 1, 10)).toBe(false);
  });
});
