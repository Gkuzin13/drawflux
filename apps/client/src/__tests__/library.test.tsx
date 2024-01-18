import App from '@/App';
import { fireEvent, screen, within } from '@testing-library/react';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import { libraryGenerator, stateGenerator } from '@/test/data-generators';
import { createNode } from '@/utils/node';

describe('library', () => {
  it('adds shapes to the library', async () => {
    // preloaded node
    const node = createNode('rectangle', [50, 50]);
    node.nodeProps.width = 20;
    node.nodeProps.height = 20;

    const preloadedState = stateGenerator({
      canvas: { present: { nodes: [node] } },
    });

    const { user, store } = renderWithProviders(<App />, { preloadedState });

    const { canvas } = await findCanvas();

    // open context menu
    fireEvent.contextMenu(canvas, { clientX: 50, clientY: 50 });

    // add to library
    await user.click(screen.getByText(/Add to library/));

    // open library drawer
    await user.click(screen.getByText(/Library/));

    const libraryItem = screen.getByTestId(/library-item/);

    const state = store.getState().library;

    expect(libraryItem).toBeInTheDocument();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].elements).toHaveLength(1);
    expect(state.items[0].elements[0]).toEqual(node);
  });

  it('removes shapes from the library', async () => {
    // preload library state
    const library = libraryGenerator(3);
    const preloadedState = stateGenerator({ library });

    const { user, store } = renderWithProviders(<App />, { preloadedState });

    // open library drawer
    await user.click(screen.getByText(/Library/i));

    const items = screen.getAllByTestId(/library-item/i);

    // check the items
    await user.click(within(items[0]).getByRole('checkbox'));
    await user.click(within(items[1]).getByRole('checkbox'));
    await user.click(within(items[2]).getByRole('checkbox'));

    // click on remove
    await user.click(screen.getByTestId(/remove-selected-items-button/i));

    const state = store.getState().library;

    expect(state.items).toHaveLength(0);
    expect(items[0]).not.toBeInTheDocument();
    expect(items[1]).not.toBeInTheDocument();
    expect(items[2]).not.toBeInTheDocument();
  });

  it('adds library item to the drawing canvas', async () => {
    // preload library state with 1 item containing 3 shapes
    const library = libraryGenerator(1, 3);
    const preloadedState = stateGenerator({ library });

    const { user, store } = renderWithProviders(<App />, { preloadedState });

    const { canvas } = await findCanvas();

    const libraryTrigger = screen.getByText(/Library/i).closest('button');

    if (libraryTrigger) {
      // open library drawer
      await user.click(libraryTrigger);
    }

    const droppableLibraryItem = library.items[0];

    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: vi.fn(() => JSON.stringify(droppableLibraryItem)),
      },
      clientX: 50,
      clientY: 50,
    });

    const state = store.getState().canvas.present;

    expect(Object.keys(state.selectedNodeIds)).toHaveLength(3);
    expect(state.nodes).toHaveLength(3);
    expect(state.nodes).toEqual(
      expect.arrayContaining(
        droppableLibraryItem.elements.map((node) => {
          return expect.objectContaining({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              id: expect.any(String),
              point: expect.any(Array),
            },
          });
        }),
      ),
    );
  });
});
