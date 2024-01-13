import App from '@/App';
import { renderWithProviders } from '@/test/test-utils';
import { fireEvent, screen } from '@testing-library/react';

describe('zoom', () => {
  describe('CTRL + Mousewheel', () => {
    it('zooms in', async () => {
      const { store } = renderWithProviders(<App />);

      const container = await screen.findByRole('presentation');

      fireEvent.wheel(container, { deltaY: -100, ctrlKey: true });

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeGreaterThan(1);
    });

    it('zooms out', async () => {
      const { store } = renderWithProviders(<App />);

      const container = await screen.findByRole('presentation');

      fireEvent.wheel(container, { deltaY: 100, ctrlKey: true });

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeLessThan(1);
    });
  });
});
