import { Node } from '../constants/base';

type CreateNodeArgs = {
  x: number;
  y: number;
} & Pick<Node, 'type'>;

export function createNode({ type, x, y }: CreateNodeArgs): Node {
  return {
    type,
    nodeProps: {
      id: `node-${Date.now()}`,
      x,
      y,
      points: [
        { x, y },
        { x, y },
      ],
    },
  };
}
