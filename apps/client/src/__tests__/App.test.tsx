import { renderWithProviders } from '@/test/test-utils';
import App from '@/App';

describe('App', () => {
  it('mounts without crashing', () => {
    const { container } = renderWithProviders(<App />);

    expect(container).toBeInTheDocument();
  });
});
