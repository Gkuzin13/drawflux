import App from '@/App';
import { renderWithProviders } from '@/test/test-utils';
import { stateGenerator } from '@/test/data-generators';
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

  describe('buttons', () => {
    it('zooms in', async () => {
      const { store, user } = renderWithProviders(<App />);

      const zoomInButton = await screen.findByTestId(/zoom-in-button/);

      await user.click(zoomInButton);

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeGreaterThan(1);
    });

    it('zooms out', async () => {
      const { store, user } = renderWithProviders(<App />);

      const zoomInButton = await screen.findByTestId(/zoom-out-button/);

      await user.click(zoomInButton);

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBeLessThan(1);
    });

    it('resets zoom', async () => {
      const preloadedState = stateGenerator({
        canvas: {
          present: {
            stageConfig: { scale: 1.5 },
          },
        },
      });

      const { store, user } = renderWithProviders(<App />, { preloadedState });

      const zoomInButton = await screen.findByTestId(/zoom-reset-button/);

      await user.click(zoomInButton);

      const state = store.getState().canvas.present;

      expect(state.stageConfig.scale).toBe(1);
    });
  });
});
