import Node from './Node';
import { type NodeComponentProps } from './Node';

type Props = Omit<NodeComponentProps, 'selected'>;

const NodeDraft = (props: Props) => {
  return <Node selected={false} {...props} />;
};

export default NodeDraft;
