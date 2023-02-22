import type { NodeType, NodeProps, NodeStyle } from '../element';

const defaultStyle: NodeStyle = {
  line: 'solid',
  color: 'black',
  size: 'medium',
  animated: false,
};
export class Node implements NodeType {
  type: NodeType['type'];
  text = null;
  style = defaultStyle;
  nodeProps = {
    id: `node-${Date.now()}`,
    width: 0,
    height: 0,
    point: [0, 0],
    rotation: 0,
    visible: true,
  } as NodeProps;

  constructor(type: NodeType['type'], x: number, y: number) {
    this.type = type;
    this.nodeProps.point = [x, y];
  }
}
