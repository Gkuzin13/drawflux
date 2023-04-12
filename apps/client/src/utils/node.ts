import type { NodeLIne, NodeType, Point, NodeObject } from '@shared';
import { colors } from '@shared';
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
