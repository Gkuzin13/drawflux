import { v4 as uuid } from 'uuid';
import { createNode } from '@/utils/node';
import { colors, type NodeObject, type User } from 'shared';

export const nodesGenerator = (
  length: number,
  type: NodeObject['type'] = 'arrow',
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
