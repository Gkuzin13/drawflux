import App from '@/App';
import { LOCAL_STORAGE_THEME_KEY } from '@/constants/app';
import { renderWithProviders } from '@/test/test-utils';
import { storage } from '@/utils/storage';
import { screen } from '@testing-library/react';

describe('dark mode switch', () => {
  it('opens menu panel and switches dark mode', async () => {
    const { user } = renderWithProviders(<App />);

    const menuButton = screen.getByLabelText(/Open Menu/);
    await user.click(menuButton);

    const switchButton = screen.getByTestId('dark-mode-switch');
    await user.click(switchButton);

    expect(document.documentElement).toHaveClass('dark-theme');

    await user.click(switchButton);

    expect(document.documentElement).not.toHaveClass('dark-theme');
  });

  it('sets dark theme from localStorage', () => {
    storage.set(LOCAL_STORAGE_THEME_KEY, 'dark');

    renderWithProviders(<App />);

    expect(document.documentElement).toHaveClass('dark-theme');
  });

  it('sets default theme from localStorage', () => {
    storage.set(LOCAL_STORAGE_THEME_KEY, 'default');

    renderWithProviders(<App />);

    expect(document.documentElement).not.toHaveClass('dark-theme');
  });
});
