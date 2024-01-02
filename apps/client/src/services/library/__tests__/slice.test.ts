import reducer, { initialState, libraryActions } from '../slice';
import { libraryGenerator, nodesGenerator } from '@/test/data-generators';

describe('library slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('adds item to the library', () => {
    const nodesToAdd = nodesGenerator(8);

    const state = reducer(undefined, libraryActions.addItem(nodesToAdd));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].elements).toEqual(nodesToAdd);
    expect(state.items[0].created).toBeDefined();
    expect(state.items[0].id).toBeDefined();
  });

  it('removes items from the library', () => {
    const previousState = libraryGenerator(8);
    const itemsIdsToRemove = [
      previousState.items[0].id,
      previousState.items[3].id,
      previousState.items[5].id,
    ];

    const state = reducer(
      previousState,
      libraryActions.removeItems(itemsIdsToRemove),
    );

    expect(state.items).toHaveLength(5);
    expect(state.items).not.toContain(previousState.items[0]);
    expect(state.items).not.toContain(previousState.items[3]);
    expect(state.items).not.toContain(previousState.items[5]);
  });
});
