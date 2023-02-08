import { Drawable } from '@/App';

export type NodesSlide = {
  nodes: Drawable[];
  addNode: (node: Drawable) => void;
};

export const createNodesSlice = (set: any, get: any) => ({
  nodes: [],
  addNode: (node: Drawable) =>
    set((state: any) => ({ nodes: [...state, node] })),
});
