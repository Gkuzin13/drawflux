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
    x: 0,
    y: 0,
    points: [],
    rotation: 0,
  } as NodeProps;

  constructor(type: NodeType['type'], x: number, y: number) {
    this.type = type;
    this.nodeProps.x = x;
    this.nodeProps.y = y;
    this.nodeProps.points = [
      { x, y },
      { x, y },
    ];
  }
}
