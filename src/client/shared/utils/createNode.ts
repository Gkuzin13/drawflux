import type { NodeType, NodeProps } from '../element';

export class Node implements NodeType {
  type: NodeType['type'];
  text = null;
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
