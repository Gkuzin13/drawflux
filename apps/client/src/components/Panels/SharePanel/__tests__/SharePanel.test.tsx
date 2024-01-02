import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import SharePanel from '../SharePanel';

describe('SharePanel', () => {
  it('displays shareable content if canvas is not shared', async () => {
    const { user } = renderWithProviders(<SharePanel isPageShared={false} />);

    // open share panel
    await user.click(screen.getByText(/Share/i));

    expect(screen.getByText(/Share this page/i)).toBeInTheDocument();
  });

  it('displays qrcode if the canvas is shared', async () => {
    const { user } = renderWithProviders(<SharePanel isPageShared />);

    // open share panel
    await user.click(screen.getByText(/Share/i));

    await waitFor(() => {
      expect(screen.getByTestId(/qr-code/i)).toBeInTheDocument();
    });
  });
});
