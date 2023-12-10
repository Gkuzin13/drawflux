import { useCallback, useState } from 'react';
import { drawNodeByType } from '@/components/Canvas/DrawingCanvas/helpers/draw';
import type { NodeObject } from 'shared';
import type { DrawPosition } from '@/components/Canvas/DrawingCanvas/helpers/draw';

type DispatchAction<T extends string, P extends NonNullable<unknown>> = {
  type: T;
  payload: P;
};

type Add = DispatchAction<'add', { node: NodeObject }>;
type Draw = DispatchAction<'draw', { nodeId: string; position: DrawPosition }>;
type Finish = DispatchAction<'finish', { nodeId: string }>;
type FinishAndKeep = DispatchAction<'finish-keep', { nodeId: string }>;

type NodeDraftAction = Add | Draw | Finish | FinishAndKeep;

type NodeDrafts = {
  [nodeId: string]: { node: NodeObject; drawing: boolean };
};

function useDrafts() {
  const [drafts, setDrafts] = useState<NodeDrafts>({});

  const dispatchAction = useCallback(({ type, payload }: NodeDraftAction) => {
    setDrafts((prevDrafts) => {
      switch (type) {
        case 'add': {
          const { node } = payload;
          const newDraftNode = { drawing: true, node };

          return { ...prevDrafts, [node.nodeProps.id]: newDraftNode };
        }
        case 'draw': {
          const { nodeId, position } = payload;

          if (nodeId in prevDrafts) {
            const { node, drawing } = prevDrafts[nodeId];

            const updatedNode = drawNodeByType({ node, position });

            const updatedDraft = { drawing, node: updatedNode };

            return { ...prevDrafts, [updatedNode.nodeProps.id]: updatedDraft };
          }

          return prevDrafts;
        }
        case 'finish': {
          const { nodeId } = payload;

          if (nodeId in prevDrafts) {
            const draftsCopy = { ...prevDrafts };

            delete draftsCopy[nodeId];

            return draftsCopy;
          }
          return prevDrafts;
        }
        case 'finish-keep': {
          const { nodeId } = payload;

          if (nodeId in prevDrafts) {
            const { node } = prevDrafts[nodeId];
            const updatedDraft = { node, drawing: false };

            return { ...prevDrafts, [nodeId]: updatedDraft };
          }
          return prevDrafts;
        }
        default:
          return prevDrafts;
      }
    });
  }, []);
  
  return [Object.values(drafts), dispatchAction] as const;
}

export default useDrafts;
