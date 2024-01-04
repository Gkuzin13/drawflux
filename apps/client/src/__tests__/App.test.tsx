import { changeJSDOMURL, renderWithProviders } from '@/test/test-utils';
import App from '@/App';
import { mockGetPageResponse } from '@/test/mocks/handlers';
import { screen, waitFor } from '@testing-library/react';
import {
  makeCollabRoomURL,
  nodesGenerator,
  stateGenerator,
} from '@/test/data-generators';

describe('App', () => {
  it('mounts without crashing', () => {
    const { container } = renderWithProviders(<App />);

    expect(container).toBeInTheDocument();
  });

  it('sets canvas state from fetched data when in collab mode', async () => {
    changeJSDOMURL(makeCollabRoomURL(mockGetPageResponse.page.id));

    const { store } = renderWithProviders(<App />);

    await waitFor(() => {
      const { nodes } = store.getState().canvas.present;

      expect(nodes).toEqual(mockGetPageResponse.page.nodes);
    });
  });

  it('calls share this page', async () => {
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
