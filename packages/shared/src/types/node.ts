import { type z } from 'zod';
import { Node } from '../schemas/node';

const { nodeProps, style, type } = Node.shape;

export type NodeObject = z.infer<typeof Node>;
export type NodeProps = z.infer<typeof nodeProps>;
export type NodeStyle = z.infer<typeof style>;
export type NodeType = z.infer<typeof type>;

export type NodeLine = NodeStyle['line'];
export type NodeSize = NodeStyle['size'];
export type NodeColor = NodeStyle['color'];

export type Point = z.infer<(typeof nodeProps)['shape']['point']>;
