import { memo } from 'react';
import NodeDraft from './NodeDraft';
import type { NodeComponentProps } from './Node';
import type { Draft } from '@/hooks/useDrafts';

type Props = {
  drafts: Draft[];
} & Omit<NodeComponentProps, 'selected' | 'node'>;

const Drafts = ({
  drafts,
  stageScale,
  onNodeChange,
  onNodeDelete,
  onTextChange,
}: Props) => {
  return (
    <>
      {drafts.map(({ node }) => {
        return (
          <NodeDraft
            key={node.nodeProps.id}
            node={node}
            stageScale={stageScale}
            onNodeChange={onNodeChange}
            onTextChange={onTextChange}
            onNodeDelete={onNodeDelete}
          />
        );
      })}
    </>
  );
};

export default memo(Drafts);
