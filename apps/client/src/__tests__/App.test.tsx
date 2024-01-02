import { renderWithProviders } from '@/test/test-utils';
import App from '@/App';
import { mockGetPageResponse } from '@/test/mocks/handlers';
import { screen, waitFor } from '@testing-library/react';
import { PAGE_URL_SEARCH_PARAM_KEY } from '@/constants/app';
import { setSearchParam } from '@/test/browser-mocks';
import { nodesGenerator, stateGenerator } from '@/test/data-generators';

describe('App', () => {
  afterEach(() => {
    Object.defineProperty(window, 'location', window.location);
  });

  it('mounts without crashing', () => {
    const { container } = renderWithProviders(<App />);

    expect(container).toBeInTheDocument();
  });

  it('sets canvas state from fetched data when in collab mode', async () => {
    setSearchParam(PAGE_URL_SEARCH_PARAM_KEY, mockGetPageResponse.page.id);

    const { store } = renderWithProviders(<App />);

    await waitFor(() => {
      const { nodes } = store.getState().canvas.present;

      expect(nodes).toEqual(mockGetPageResponse.page.nodes);
    });
  });

  it('calls share this page', async () => {
    Object.defineProperty(window.location, 'reload', {
      value: vi.fn(),
    });

    const { user } = renderWithProviders(<App />, {
      preloadedState: stateGenerator({
        canvas: {
          present: {
            nodes: nodesGenerator(6),
          },
        },
      }),
    });

    await user.click(screen.getByText(/Share/i));
    await user.click(screen.getByText(/Share this page/i));

    await waitFor(() => {
      expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
    });
  });
});
