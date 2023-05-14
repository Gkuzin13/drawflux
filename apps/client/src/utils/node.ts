import type { IRect } from 'konva/lib/types';
import type { NodeLine, NodeType, Point, NodeObject, NodeProps } from 'shared';
import { colors } from 'shared';
import { v4 as uuid } from 'uuid';
import { LINE, SIZE } from '../constants/style';
import { getNodeRect, isNodeInView } from './position';

export const createNode = (type: NodeType, point: Point): NodeObject => {
  return {
    type,
    text: null,
    style: {
      line: LINE[0].value as NodeLine,
      color: colors.black,
      size: SIZE[1].value,
      animated: false,
    },
    nodeProps: {
      id: uuid(),
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

const DUPLICATION_GAP = 16;

export function duplicateNodes(nodes: NodeObject[]): NodeObject[] {
  const nodeMinXEdge = Math.min(...nodes.map((node) => getNodeRect(node).x));
  const nodeMaxXEdge = Math.max(
    ...nodes.map((node) => {
      const { x, width } = getNodeRect(node);
      return x + width;
    }),
  );

  const duplicationStartXPoint = nodeMaxXEdge + DUPLICATION_GAP;
  const distance = duplicationStartXPoint - nodeMinXEdge;

  return nodes.map((node) => {
    const updatedNodeProps: Partial<NodeProps> = {
      id: uuid(),
      point: [node.nodeProps.point[0] + distance, node.nodeProps.point[1]],
    };

    if (node.nodeProps.points) {
      updatedNodeProps.points = node.nodeProps.points.map((point) => [
        point[0] + distance,
        point[1],
      ]);
    }

    return { ...node, nodeProps: { ...node.nodeProps, ...updatedNodeProps } };
  });
}

export function allNodesInView(
  nodes: NodeObject[],
  stageRect: IRect,
  stageScale: number,
) {
  return nodes.every((node) => isNodeInView(node, stageRect, stageScale));
}
