import historyReducer, { historyActions } from '../history';
import { createAction, createReducer } from '@reduxjs/toolkit';
import type { HistoryState } from '../history';
import { simpleObjectsGenerator } from '@/test/data-generators';

type State = {
  objects: ReturnType<typeof simpleObjectsGenerator>;
  type: 'foo' | 'bar';
};

const initialState: State = { objects: [], type: 'foo' };

const addObjects = createAction<State['objects']>('addObjects');
const setType = createAction<State['type']>('setType');
const actionsToIgnore = [setType] as const;

const testReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addObjects, (state, action) => {
      state.objects.push(...action.payload);
    })
    .addCase(setType, (state, action) => {
      state.type = action.payload;
    });
});

const reducer = historyReducer(testReducer, initialState, actionsToIgnore);

const initialHistoryState: HistoryState<typeof initialState> = {
  past: [
    { ...initialState, objects: simpleObjectsGenerator(2) },
    { ...initialState, objects: simpleObjectsGenerator(1) },
  ],
  present: initialState,
  future: [{ ...initialState, objects: simpleObjectsGenerator(3) }],
};

describe('history reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: undefined as never });

    expect(state).toEqual({ past: [], present: initialState, future: [] });
  });

  it('handles history undo', () => {
    const state = reducer(initialHistoryState, historyActions.undo());

    expect(state).toEqual({
      past: [initialHistoryState.past[0]],
      present: initialHistoryState.past[1],
      future: [initialHistoryState.present, ...initialHistoryState.future],
    });
  });

  it('handles history undo when there is no past', () => {
    const initialStateWithNoPast = { ...initialHistoryState, past: [] };

    const state = reducer(initialStateWithNoPast, historyActions.undo());

    expect(state).toEqual(initialStateWithNoPast);
  });

  it('handles history redo', () => {
    const state = reducer(initialHistoryState, historyActions.redo());

    expect(state).toEqual({
      past: [...initialHistoryState.past, initialHistoryState.present],
      present: initialHistoryState.future[0],
      future: [],
    });
  });

  it('handles history redo when there is no future', () => {
    const initialStateWithNoFuture = { ...initialHistoryState, future: [] };

    const state = reducer(initialStateWithNoFuture, historyActions.redo());

    expect(state).toEqual(initialStateWithNoFuture);
  });

  it('handles history undo and redo in sequence', () => {
    const undoedState = reducer(initialHistoryState, historyActions.undo());
    const twiceUndoedState = reducer(undoedState, historyActions.undo());

    expect(twiceUndoedState).toEqual({
      past: [],
      present: undoedState.past[0],
      future: [undoedState.present, ...undoedState.future],
    });

    const redoedState = reducer(twiceUndoedState, historyActions.redo());
    const twiceRedoedState = reducer(redoedState, historyActions.redo());

    expect(twiceRedoedState).toEqual(initialHistoryState);
  });

  it('resets history', () => {
    const state = reducer(initialHistoryState, historyActions.reset());

    expect(state).toEqual({
      past: [],
      present: initialState,
      future: [],
    });
  });

  it('ignores the provided action types', () => {
    const state = reducer(
      { past: [], present: initialState, future: [] },
      actionsToIgnore[0]('bar'),
    );

    expect(state.past).toEqual([]);
    expect(state.present).toEqual({ ...initialState, type: 'bar' });
    expect(state.future).toEqual([]);
  });

  it('adds previous present state to past and sets result of provided reducer to present', () => {
    const objects = simpleObjectsGenerator(2);
    const state = reducer(initialHistoryState, addObjects(objects));

    expect(state.past).toEqual([
      ...initialHistoryState.past,
      initialHistoryState.present,
    ]);
    expect(state.present).toEqual({ ...state.present, objects });
    expect(state.future).toEqual([]);
  });
});
