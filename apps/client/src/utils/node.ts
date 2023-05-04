import type { NodeLIne, NodeType, Point, NodeObject } from 'shared';
import { colors } from 'shared';
import { LINE, SIZE } from '../constants/style';

export const createNode = (type: NodeType, point: Point): NodeObject => {
  return {
    type,
    text: null,
    style: {
      line: LINE[0].value as NodeLIne,
      color: colors.black,
      size: SIZE[1].value,
      animated: false,
    },
    nodeProps: {
      id: `node-${Date.now()}`,
      point,
      rotation: 0,
      visible: true,
    },
  };
};

export function reorderNodes(nodesIdsToReorder: string[], nodes: NodeObject[]) {
  const ids = new Set(nodesIdsToReorder);
  const nodesCopy = [...nodes];

  function hasMultipleNodes() {
    return nodes.length > 1;
  }

  function swap(index1: number, index2: number) {
    const node1 = nodesCopy[index1];
    const node2 = nodesCopy[index2];

    nodesCopy.splice(index2, 1, node1);
    nodesCopy.splice(index1, 1, node2);
  }

  function toStart() {
    if (!hasMultipleNodes()) {
      return nodesCopy;
    }

    for (const [index, node] of nodesCopy.entries()) {
      if (ids.has(node.nodeProps.id)) {
        nodesCopy.splice(index, 1);
        nodesCopy.unshift(node);
        ids.delete(node.nodeProps.id);
      }
    }

    return nodesCopy;
  }

  function backward() {
    if (!hasMultipleNodes()) {
      return nodesCopy;
    }

    for (const [index, node] of nodesCopy.entries()) {
      if (index > 0 && ids.has(node.nodeProps.id)) {
        swap(index, index - 1);
        ids.delete(node.nodeProps.id);
      }
    }

    return nodesCopy;
  }

  function forward() {
    if (!hasMultipleNodes()) {
      return nodesCopy;
    }

    for (let index = nodesCopy.length - 2; index >= 0; index--) {
      const node = nodesCopy[index];

      if (ids.has(node.nodeProps.id)) {
        swap(index, index + 1);
        ids.delete(node.nodeProps.id);
      }
    }

    return nodesCopy;
  }

  function toEnd() {
    if (!hasMultipleNodes()) {
      return nodesCopy;
    }

    for (const [index, node] of nodesCopy.entries()) {
      if (ids.has(node.nodeProps.id)) {
        nodesCopy.splice(index, 1);
        nodesCopy.push(node);
        ids.delete(node.nodeProps.id);
      }
    }

    return nodesCopy;
  }

  return { toEnd, toStart, forward, backward };
}
