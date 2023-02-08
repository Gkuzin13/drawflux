import { Drawable } from '@/App';
import { create } from 'zustand';

type ActionsStore = {
  removeEmptyTextNodes: (drawables: Drawable[]) => Drawable[];
};

export const useActionsStore = create<ActionsStore>()((set) => ({
  removeEmptyTextNodes: (drawables) =>
    drawables.filter((drawable) => {
      if (!drawable.text?.length) return false;

      return true;
    }),
}));
