import App from '@/App';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { stateGenerator } from '@/test/data-generators';
import { createNode } from '@/utils/node';

describe('context menu', () => {
  it('opens canvas context menu', async () => {
    const { user } = renderWithProviders(<App />);

    const container = await screen.findByRole('presentation');
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    await user.pointer({ keys: '[MouseRight]', target: canvas });

    const contextMenu = screen.getByTestId(/context-menu/i);
    const menuContainer = within(contextMenu);

    expect(contextMenu).toBeInTheDocument();
    expect(menuContainer.getByText(/Select All/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Paste/i)).toBeInTheDocument();
  });

  it('opens shape context menu', async () => {
    const node = createNode('rectangle', [20, 30]);
    node.nodeProps.width = 50;
    node.nodeProps.height = 50;

    const preloadedState = stateGenerator({
      canvas: { present: { nodes: [node] } },
    });

    const { user } = renderWithProviders(<App />, { preloadedState });

    const container = await screen.findByRole('presentation');
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    await user.pointer({
      keys: '[MouseRight]',
      target: canvas,
      coords: { clientX: 20, clientY: 30 },
    });

    const contextMenu = screen.getByTestId(/context-menu/i);
    const menuContainer = within(contextMenu);

    expect(contextMenu).toBeInTheDocument();
    expect(menuContainer.getByText(/Copy/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Duplicate/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Add to library/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Bring to front/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Bring forward/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Send backward/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Send to back/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Select none/i)).toBeInTheDocument();
    expect(menuContainer.getByText(/Delete/i)).toBeInTheDocument();
  });

  it('duplicates nodes and selects them', async () => {
    const node = createNode('rectangle', [20, 30]);
    node.nodeProps.width = 50;
    node.nodeProps.height = 50;

    const preloadedState = stateGenerator({
      canvas: { present: { nodes: [node] } },
    });

    const { user, store } = renderWithProviders(<App />, { preloadedState });

    const container = await screen.findByRole('presentation');
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    await user.pointer({
      keys: '[MouseRight]',
      target: canvas,
      coords: { clientX: 20, clientY: 30 },
    });

    const contextMenu = screen.getByTestId(/context-menu/i);
    const menuContainer = within(contextMenu);

    await user.click(menuContainer.getByText(/Duplicate/i));

    const state = store.getState().canvas.present;

    expect(state.nodes.length).toBe(2);
    expect(state.nodes).toContainEqual(
      expect.objectContaining({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          id: expect.any(String),
          point: expect.any(Array),
        },
      }),
    );
    expect(Object.keys(state.selectedNodeIds)).toHaveLength(1);
  });
});
