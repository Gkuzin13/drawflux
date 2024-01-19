import { memo } from 'react';
import NodeDraft from '../Node/NodeDraft';
import type { NodeComponentProps } from '../Node/Node';
import type { Draft } from '@/hooks/useDrafts';

type Props = {
  drafts: Draft[];
  editingNodeId: string | null;
} & Omit<NodeComponentProps, 'selected' | 'node' | 'editing'>;

const Drafts = ({ drafts, editingNodeId, ...restProps }: Props) => {
  return (
    <>
      {drafts.map(({ node }) => {
        return (
          <NodeDraft
            key={node.nodeProps.id}
            editing={node.nodeProps.id === editingNodeId}
            node={node}
            {...restProps}
          />
        );
      })}
    </>
  );
};

export default memo(Drafts);
