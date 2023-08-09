import reducer, { type CanvasHistoryState, historyActions } from '../history';
import canvasReducer, {
  initialState as initialCanvasState,
} from '@/stores/slices/canvas';
import { nodesGenerator } from '@/test/data-generators';

describe('history reducer', () => {
  const historyReducer = reducer(canvasReducer);

  const initialState: CanvasHistoryState = {
    past: [
      { ...initialCanvasState, nodes: nodesGenerator(1) },
      { ...initialCanvasState, nodes: nodesGenerator(2) },
    ],
    present: initialCanvasState,
    future: [{ ...initialCanvasState, nodes: nodesGenerator(3) }],
  };

  it('returns the initial state', () => {
    const state = historyReducer(undefined, { type: undefined as never });

    expect(state).toEqual({
      past: [],
      present: initialCanvasState,
      future: [],
    });
  });

  it('handles history undo', () => {
    const state = historyReducer(initialState, historyActions.undo());

    expect(state).toEqual({
      past: [initialState.past[0]],
      present: initialState.past[1],
      future: [initialState.present, ...initialState.future],
    });
  });

  it('handles history undo when there is no past', () => {
    const initialStateWithNoPast = { ...initialState, past: [] };

    const state = historyReducer(initialStateWithNoPast, historyActions.undo());

    expect(state).toEqual(initialStateWithNoPast);
  });

  it('handles history redo', () => {
    const state = historyReducer(initialState, historyActions.redo());

    expect(state).toEqual({
      past: [...initialState.past, initialState.present],
      present: initialState.future[0],
      future: [],
    });
  });

  it('handles history redo when there is no future', () => {
    const initialStateWithNoFuture = { ...initialState, future: [] };

    const state = historyReducer(
      initialStateWithNoFuture,
      historyActions.redo(),
    );

    expect(state).toEqual(initialStateWithNoFuture);
  });

  it('handles history undo and redo in sequence', () => {
    const undoedState = historyReducer(initialState, historyActions.undo());
    const twiceUndoedState = historyReducer(undoedState, historyActions.undo());

    expect(twiceUndoedState).toEqual({
      past: [],
      present: undoedState.past[0],
      future: [undoedState.present, ...undoedState.future],
    });

    const redoedState = historyReducer(twiceUndoedState, historyActions.redo());
    const twiceRedoedState = historyReducer(redoedState, historyActions.redo());

    expect(twiceRedoedState).toEqual(initialState);
  });

  it('resets history', () => {
    const state = historyReducer(initialState, historyActions.reset());

    expect(state).toEqual({
      past: [],
      present: initialCanvasState,
      future: [],
    });
  });
});
