import * as remeda from 'remeda';
import { v4 as uuid } from 'uuid';
import { createNode } from '@/utils/node';
import { CONSTANTS, colors } from 'shared';
import { urlSearchParam } from '@/utils/url';
import { defaultPreloadedState } from './test-utils';
import type { NodeObject, NodeType, User } from 'shared';
import type { DeepPartial } from '@reduxjs/toolkit';
import type { Library } from '@/constants/app';

export const nodesGenerator = (
  length: number,
  type: NodeType = 'arrow',
): NodeObject[] => {
  return Array.from({ length }, (_, index) => {
    const node = createNode(type, [index + 10, index + 20]);

    if (node.type === 'arrow' || node.type === 'draw') {
      node.nodeProps.points = [[index + 20, index + 30]];
    }

    if (node.type === 'rectangle' || node.type === 'ellipse') {
      node.nodeProps.width = 50;
      node.nodeProps.height = 50;
    }

    if (node.type === 'text') {
      node.text = 'Hello world';
    }

    return node;
  });
};

export const usersGenerator = (length: number): User[] => {
  return Array.from({ length }, (_, index) => ({
    id: uuid(),
    name: `User ${index + 1}`,
    color: Object.keys(colors)[index] as User['color'],
  }));
};

export const stateGenerator = (
  state: DeepPartial<typeof defaultPreloadedState>,
) => {
  return remeda.mergeDeep(
    defaultPreloadedState,
    state,
  ) as typeof defaultPreloadedState;
};

export const libraryGenerator = (length: number, shapes = 1): Library => {
  return {
    items: Array.from({ length }, () => ({
      id: uuid(),
      created: Date.now(),
      elements: nodesGenerator(shapes, 'rectangle'),
    })),
  };
};

export const makeCollabRoomURL = (roomId: string, baseUrl = window.origin) => {
  return urlSearchParam.set(CONSTANTS.COLLAB_ROOM_URL_PARAM, roomId, baseUrl);
};

export const nodeTypeGenerator = (): NodeType[] => {
  return ['arrow', 'draw', 'ellipse', 'laser', 'rectangle', 'text'];
};

export const simpleObjectsGenerator = (length = 1) => {
  return Array.from({ length }, () => ({
    id: Date.now(),
    name: `test${Date.now()}`,
  }));
};
