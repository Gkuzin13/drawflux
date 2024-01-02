import { useCallback, useState } from 'react';
import { drawNodeByType } from '@/components/Canvas/DrawingCanvas/helpers/draw';
import type { NodeObject } from 'shared';
import type { DrawPosition } from '@/components/Canvas/DrawingCanvas/helpers/draw';

type DispatchAction<T extends string, P extends NonNullable<unknown>> = {
  type: T;
  payload: P;
};

type Create = DispatchAction<'create', { node: NodeObject }>;
type Draw = DispatchAction<'draw', { nodeId: string; position: DrawPosition }>;
type Update = DispatchAction<'update', { node: NodeObject; }>;
type Finish = DispatchAction<'finish', { nodeId: string; keep?: boolean }>;

type NodeDraftAction = Create | Draw | Update | Finish;

type Drafts = {
  [nodeId: string]: Draft;
};

export type Draft = { node: NodeObject; drawing: boolean };

function useDrafts() {
  const [drafts, setDrafts] = useState<Drafts>({});

  const dispatchAction = useCallback(({ type, payload }: NodeDraftAction) => {
    setDrafts((prevDrafts) => {
      switch (type) {
        case 'create': {
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
        case 'update': {
          const { node } = payload;

          if (node.nodeProps.id in prevDrafts) {
            const prevDraft = prevDrafts[node.nodeProps.id];

            const updatedDraft = { drawing: prevDraft.drawing, node };

            return { ...prevDrafts, [node.nodeProps.id]: updatedDraft };
          }

          return prevDrafts;
        }
        case 'finish': {
          const { nodeId, keep } = payload;

          if (nodeId in prevDrafts) {
            const draftsCopy = { ...prevDrafts };

            if (keep) {
              const { node } = prevDrafts[nodeId];
              const updatedDraft = { node, drawing: false };

              return { ...draftsCopy, [nodeId]: updatedDraft };
            }

            delete draftsCopy[nodeId];
            return draftsCopy;
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
