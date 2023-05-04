import type { NodeObject } from 'shared';
import { createNode } from '@/utils/node';

export const nodesGenerator = (
  length: number,
  type: NodeObject['type'] = 'arrow',
): NodeObject[] => {
  return Array.from({ length }, (_, index) =>
    createNode(type, [index, index + length]),
  );
};
