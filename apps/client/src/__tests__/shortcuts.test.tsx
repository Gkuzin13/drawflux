import App from '@/App';
import { TOOLS } from '@/constants/panels/tools';
import { renderWithProviders } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';

describe('tools', () => {
  TOOLS.forEach((tool) => {
    it(`selects ${tool.value}`, async () => {
      const { store } = renderWithProviders(<App />);

      await userEvent.keyboard(tool.key);

      const { toolType } = store.getState().canvas.present;

      expect(toolType).toEqual(tool.value);
    });
  });
});
