import App from '@/App';
import { nodesGenerator, stateGenerator } from '@/test/data-generators';
import { renderWithProviders } from '@/test/test-utils';
import { initialState as initialCanvasState } from '@/services/canvas/slice';
import { screen } from '@testing-library/react';
import { historyActions } from '@/stores/reducers/history';

describe('history', () => {
  it('dispatches undo history', async () => {
    const preloadedState = stateGenerator({
      canvas: {
        past: [{ ...initialCanvasState, nodes: nodesGenerator(3) }],
      },
    });

    const { store, user } = renderWithProviders(<App />, { preloadedState });

    const undoHistoryButton = await screen.findByTestId(/undo-history-button/);

    await user.click(undoHistoryButton);

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.undo());
  });

  it('dispatches redo history', async () => {
    const preloadedState = stateGenerator({
      canvas: {
        future: [{ ...initialCanvasState, nodes: nodesGenerator(3) }],
      },
    });

    const { store, user } = renderWithProviders(<App />, { preloadedState });

    const redoHistoryButton = await screen.findByTestId(/redo-history-button/);

    await user.click(redoHistoryButton);

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.redo());
  });
});
