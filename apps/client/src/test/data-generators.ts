import { v4 as uuid } from 'uuid';
import { createNode } from '@/utils/node';
import { colors } from 'shared';
import { defaultPreloadedState } from './test-utils';
import type { NodeObject, NodeType, User } from 'shared';
import { deepMerge } from '@/utils/object';
import type { DeepPartial } from '@reduxjs/toolkit';

export const nodesGenerator = (
  length: number,
  type: NodeType = 'arrow',
): NodeObject[] => {
  return Array.from({ length }, (_, index) =>
    createNode(type, [index, index + length]),
  );
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
  return deepMerge(
    state,
    defaultPreloadedState,
  ) as typeof defaultPreloadedState;
};
