import App from '@/App';
import {
  defaultPreloadedState,
  renderWithProviders,
  setupTestStore,
} from '@/test/test-utils';
import { TOOLS } from '@/constants/panels';
import { nodesGenerator, stateGenerator } from '@/test/data-generators';
import { canvasActions } from '@/services/canvas/slice';
import { mapNodesIds } from '@/utils/node';
import { historyActions } from '@/stores/reducers/history';

describe('tools', () => {
  TOOLS.forEach((tool) => {
    it(`dispatches setToolType (${tool.value}) action on ${tool.key} key pressed`, async () => {
      const { user, store } = renderWithProviders(<App />, {
        store: setupTestStore(),
      });

      await user.keyboard(tool.key);

      expect(store.dispatch).toHaveBeenCalledWith(
        canvasActions.setToolType(tool.value),
      );
    });
  });
});

describe('canvas', () => {
  it('dispatches selectAllNodes action on Ctrl + A key combo', async () => {
    const nodes = nodesGenerator(3, 'rectangle');
    const preloadedState = stateGenerator({ canvas: { present: { nodes } } });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}a{/Control}');

    expect(store.dispatch).toHaveBeenCalledWith(canvasActions.selectAllNodes());
  });

  it('dispatches copyNodes action on Ctrl + C key combo', async () => {
    const nodes = nodesGenerator(3, 'rectangle');
    const selectedNodes = [nodes[0], nodes[1]];

    const preloadedState = stateGenerator({
      canvas: {
        present: {
          nodes,
          selectedNodeIds: {
            [selectedNodes[0].nodeProps.id]: true,
            [selectedNodes[1].nodeProps.id]: true,
          },
        },
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}c{/Control}');

    expect(store.dispatch).toHaveBeenCalledWith(canvasActions.copyNodes());
  });

  it('dispatches addNodes with copied nodes action on Ctrl + V key combo', async () => {
    const nodes = nodesGenerator(3, 'rectangle');

    const preloadedState = stateGenerator({
      canvas: {
        present: { nodes, copiedNodes: [nodes[0], nodes[1]] },
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}v{/Control}');

    const { copiedNodes } = store.getState().canvas.present;

    const dispatchPayload = canvasActions.addNodes(copiedNodes, {
      duplicate: true,
      selectNodes: true,
    });

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      ...dispatchPayload,
      payload: expect.arrayContaining(
        dispatchPayload.payload.map((node) => {
          return expect.objectContaining({
            ...node,
            nodeProps: { ...node.nodeProps, id: expect.any(String) },
          });
        }),
      ),
    });
  });

  it('duplicated nodes and selects them on Ctrl + D key combo', async () => {
    const nodes = nodesGenerator(3, 'rectangle');
    const selectedNodes = [nodes[0], nodes[1]];

    const preloadedState = stateGenerator({
      canvas: {
        present: {
          nodes,
          selectedNodeIds: {
            [selectedNodes[0].nodeProps.id]: true,
            [selectedNodes[1].nodeProps.id]: true,
          },
        },
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}d{/Control}');

    const state = store.getState().canvas.present;

    expect(state.nodes).toHaveLength(5);
    expect(state.nodes).toEqual(
      expect.arrayContaining(
        selectedNodes.map((node) => {
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
    expect(Object.keys(state.selectedNodeIds)).toHaveLength(2);
  });

  it('dispatches deleteNodes on Del key', async () => {
    const nodes = nodesGenerator(3, 'rectangle');
    const selectedNodes = [nodes[0], nodes[1]];

    const preloadedState = stateGenerator({
      canvas: {
        present: {
          nodes,
          selectedNodeIds: {
            [selectedNodes[0].nodeProps.id]: true,
            [selectedNodes[1].nodeProps.id]: true,
          },
        },
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Delete}');

    expect(store.dispatch).toHaveBeenCalledWith(
      canvasActions.deleteNodes(mapNodesIds(selectedNodes)),
    );
  });

  it('dispatches history undo action on Ctrl + Z key combo', async () => {
    const preloadedState = stateGenerator({
      canvas: {
        past: [
          {
            ...defaultPreloadedState.canvas.present,
          },
        ],
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}z{/Control}');

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.undo());
  });

  it('dispatches history redo action on Ctrl + Shift + Z key combo', async () => {
    const preloadedState = stateGenerator({
      canvas: {
        future: [
          {
            ...defaultPreloadedState.canvas.present,
          },
        ],
      },
    });

    const { user, store } = renderWithProviders(<App />, {
      store: setupTestStore(preloadedState),
    });

    await user.keyboard('{Control>}{Shift>}z{/Control}{/Shift}');

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.redo());
  });
});
