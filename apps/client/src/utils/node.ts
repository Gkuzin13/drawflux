import { v4 as uuid } from 'uuid';
import {
  getCanvasCenterPosition,
  getNodesMinMaxPoints,
  isNodeFullyInView,
} from './position';
import { DUPLICATION_GAP } from '@/constants/app';
import type { IRect, Vector2d } from 'konva/lib/types';
import type { NodeType, Point, NodeObject, StageConfig } from 'shared';

export const createNode = <T extends NodeType>(
  type: T,
  point: Point,
): NodeObject<T> => {
  return {
    type,
    text: null,
    style: {
      opacity: 1,
      line: 'solid',
      color: type === 'laser' ? 'red600' : 'black',
      size: 'medium',
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

export function cloneNode(node: NodeObject): NodeObject {
  return {
    ...node,
    nodeProps: {
      ...node.nodeProps,
      id: uuid(),
    },
  };
}

export function makeNodesCopy(nodes: NodeObject[]): NodeObject[] {
  return nodes.map(cloneNode);
}

export function duplicateNodes(
  nodes: NodeObject[],
  distance: Vector2d,
): NodeObject[] {
  return nodes.map((node) => {
    const clonedNode = cloneNode(node);

    clonedNode.nodeProps.point = [
      clonedNode.nodeProps.point[0] + distance.x,
      clonedNode.nodeProps.point[1] + distance.y,
    ];

    if (clonedNode.nodeProps.points) {
      clonedNode.nodeProps.points = clonedNode.nodeProps.points.map(
        ([x, y]) => [x + distance.x, y + distance.y],
      );
    }

    return clonedNode;
  });
}

export function duplicateNodesAtPosition(nodes: NodeObject[], position: Point) {
  const { minX, minY, maxX, maxY } = getNodesMinMaxPoints(nodes);

  const distance = {
    x: position[0] - (maxX + minX) / 2,
    y: position[1] - (maxY + minY) / 2,
  };

  return duplicateNodes(nodes, distance);
}

export function duplicateNodesToRight(nodes: NodeObject[]) {
  const { minX, maxX } = getNodesMinMaxPoints(nodes);

  const distance = { x: maxX - minX + DUPLICATION_GAP, y: 0 };

  return duplicateNodes(nodes, distance);
}

export function duplicateNodesAtCenter(
  nodes: NodeObject[],
  stageConfig: StageConfig,
) {
  const stageCenter = getCanvasCenterPosition(
    {
      x: stageConfig.position.x,
      y: stageConfig.position.y,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    stageConfig.scale,
  );

  return duplicateNodesAtPosition(nodes, [stageCenter.x, stageCenter.y]);
}

export function allNodesInView(
  nodes: NodeObject[],
  stageRect: IRect,
  stageScale: number,
) {
  return nodes.every((node) => isNodeFullyInView(node, stageRect, stageScale));
}

export function mapNodesIds(nodes: NodeObject[]): string[] {
  if (!nodes.length) {
    return [];
  }

  return nodes.map((node) => node.nodeProps.id);
}

export function isValidNode(node: NodeObject) {
  if (node.type === 'text' && !node.text?.length) {
    return false;
  }

  if (node.type === 'arrow' && !node.nodeProps.points) {
    return false;
  }

  if (node.type === 'draw' && !node.nodeProps.points) {
    return false;
  }

  return true;
}
