import type { NodeType, Point } from '../element';

export const createNode = (type: NodeType['type'], point: Point): NodeType => {
  return {
    type,
    text: null,
    style: {
      line: 'solid',
      color: 'black',
      size: 'medium',
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
