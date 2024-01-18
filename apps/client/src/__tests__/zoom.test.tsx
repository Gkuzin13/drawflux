import App from '@/App';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import { fireEvent } from '@testing-library/react';

describe('zoom', () => {
  describe('CTRL + Mousewheel', () => {
    it('zooms in', async () => {
      const { store } = renderWithProviders(<App />);

      const { canvas } = await findCanvas();

      fireEvent.wheel(canvas, { deltaY: -100, ctrlKey: true });

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeGreaterThan(1);
    });

    it('zooms out', async () => {
      const { store } = renderWithProviders(<App />);

      const { canvas } = await findCanvas();

      fireEvent.wheel(canvas, { deltaY: 100, ctrlKey: true });

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeLessThan(1);
    });
  });
});
