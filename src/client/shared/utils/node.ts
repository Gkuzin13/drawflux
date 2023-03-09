import type { NodeType, Point } from '../constants/element';
import { LINE, SIZE } from '../constants/style';
import { themeColors } from '../styles/theme';

export const createNode = (type: NodeType['type'], point: Point): NodeType => {
  return {
    type,
    text: null,
    style: {
      line: LINE[0].value,
      color: themeColors.black,
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
