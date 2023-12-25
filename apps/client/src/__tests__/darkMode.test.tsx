import App from '@/App';
import { renderWithProviders } from '@/test/test-utils';
import { screen } from '@testing-library/react';

describe('dark mode switch', () => {
  it('opens menu panel and toggles dark mode', async () => {
    const { user } = renderWithProviders(<App />);

    const menuButton = screen.getByLabelText(/Open Menu/);
    await user.click(menuButton);

    const switchButton = screen.getByTestId('dark-mode-switch');
    await user.click(switchButton);

    expect(document.documentElement).toHaveClass('dark-theme');

    await user.click(switchButton);

    expect(document.documentElement).not.toHaveClass('dark-theme');
  });
});
