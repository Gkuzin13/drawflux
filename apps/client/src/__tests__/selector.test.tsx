import App from '@/App';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import { nodesGenerator, stateGenerator } from '@/test/data-generators';

describe('selector', () => {
  // [TODO]
  it.skip('selects an element on press', async () => {
    const nodes = nodesGenerator(1, 'rectangle');
    nodes[0].nodeProps.point = [100, 100];
    nodes[0].nodeProps.width = 20;
    nodes[0].nodeProps.height = 20;
    nodes[0].style.fill = 'solid';

    const preloadedState = stateGenerator({
      canvas: { present: { nodes, toolType: 'select' } },
    });

    const { store, user } = renderWithProviders(<App />, { preloadedState });

    const { canvas } = await findCanvas();

    // press at [20, 30]
    await user.pointer({
      target: canvas,
      keys: '[MouseLeft>]',
      coords: {
        clientX: 100,
        clientY: 100,
      },
    });

    const state = store.getState().canvas.present;
    expect(state.selectedNodeIds).toEqual({ [nodes[0].nodeProps.id]: true });
  });

  it('unselects an element when pressing on on empty', async () => {
    const nodes = nodesGenerator(2, 'rectangle');
    nodes[0].nodeProps.point = [20, 30];
    nodes[0].nodeProps.width = 10;
    nodes[0].nodeProps.height = 10;
    nodes[0].style.fill = 'solid';

    const preloadedState = stateGenerator({
      canvas: {
        present: {
          nodes,
          toolType: 'select',
          selectedNodeIds: { [nodes[0].nodeProps.id]: true },
        },
      },
    });

    const { store, user } = renderWithProviders(<App />, { preloadedState });

    const { canvas } = await findCanvas();

    // press and release at [100, 100] (empty area)
    await user.pointer([
      {
        target: canvas,
        keys: '[MouseLeft>]',
        coords: { clientX: 100, clientY: 100 },
      },
      {
        keys: '[/MouseLeft]',
      },
    ]);

    const state = store.getState().canvas.present;

    expect(state.selectedNodeIds).toEqual({});
  });
});
