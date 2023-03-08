import type { NodeType, Point } from '../constants/element';
import { LINE, SIZE } from '../constants/style';

export const createNode = (type: NodeType['type'], point: Point): NodeType => {
  return {
    type,
    text: null,
    style: {
      line: LINE[0].value,
      color: 'black',
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
