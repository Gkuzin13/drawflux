import { screen, within } from '@testing-library/react';
import { nodesGenerator, stateGenerator } from '@/test/data-generators';
import { renderWithProviders } from '@/test/test-utils';
import Panels from './Panels';
import {
  canvasActions,
  initialState as initialCanvasState,
} from '@/services/canvas/slice';
import { historyActions } from '@/stores/reducers/history';
import { DEFAULT_ZOOM_VALUE, ZOOM_RANGE } from '@/constants/app';
import {
  FILL,
  GRID_COLORS,
  LINE,
  OPACITY,
  SIZE,
  TOOLS,
} from '@/constants/panels';

const nodes = nodesGenerator(3, 'rectangle');

/**
 * apply different style to nodes to allow for testing every button
 * starting from the first
 */
nodes[0].style.color = 'gray600';
nodes[0].style.size = 'extra-large';
nodes[0].style.line = 'dotted';

const selectedNodeIdsArray = [nodes[0].nodeProps.id, nodes[1].nodeProps.id];
const selectedNodeIds = Object.fromEntries(
  selectedNodeIdsArray.map((id) => [id, true]),
);
const selectedNodes = nodes.filter(
  (node) => node.nodeProps.id in selectedNodeIds,
);

describe('style panel', () => {
  const preloadedState = stateGenerator({
    canvas: { present: { nodes, selectedNodeIds } },
  });

  it('toggles render state based on selectedNodeIds', () => {
    const { rerender } = renderWithProviders(
      <Panels selectedNodeIds={selectedNodeIdsArray} />,
    );

    expect(screen.getByTestId(/style-panel/)).toBeInTheDocument();

    rerender(<Panels selectedNodeIds={[]} />);

    expect(screen.queryByTestId(/style-panel/)).toBeNull();
  });

  describe('colors grid', () => {
    GRID_COLORS.forEach((color) => {
      it(`dispatches nodes update with ${color.name} color`, async () => {
        const { store, user } = renderWithProviders(
          <Panels selectedNodeIds={selectedNodeIdsArray} />,
          { preloadedState },
        );

        await user.click(screen.getByTestId(`${color.value}-color-button`));

        expect(store.dispatch).toHaveBeenCalledWith(
          canvasActions.updateNodes(
            selectedNodes.map((node) => {
              return { ...node, style: { ...node.style, color: color.value } };
            }),
          ),
        );
      });
    });

    it('should have all buttons unselected if selected nodes have different colors', () => {
      renderWithProviders(<Panels selectedNodeIds={selectedNodeIdsArray} />, {
        preloadedState,
      });

      const colorsGrid = screen.getByTestId(/colors-grid/);

      GRID_COLORS.forEach((color) => {
        const colorButton = within(colorsGrid).getByTestId(
          `${color.value}-color-button`,
        );

        expect(colorButton).toHaveAttribute('data-state', 'unchecked');
        expect(colorButton).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('opacity', () => {
    it('dispatches nodes update with new opacity value', async () => {
      const { user, store } = renderWithProviders(
        <Panels selectedNodeIds={selectedNodeIdsArray} />,
        {
          preloadedState,
        },
      );

      screen.getByTestId(/opacity-slider/).focus();

      await user.keyboard('[ArrowLeft]');

      expect(store.dispatch).toHaveBeenCalledWith(
        canvasActions.updateNodes(
          selectedNodes.map((node) => {
            return {
              ...node,
              style: { ...node.style, opacity: 1 - OPACITY.step },
            };
          }),
        ),
      );
    });
  });

  describe('size', () => {
    SIZE.forEach((size) => {
      it(`dispatches nodes update with ${size.name} size`, async () => {
        const { store, user } = renderWithProviders(
          <Panels selectedNodeIds={selectedNodeIdsArray} />,
          { preloadedState },
        );

        await user.click(screen.getByTestId(`${size.value}-size-button`));

        expect(store.dispatch).toHaveBeenCalledWith(
          canvasActions.updateNodes(
            selectedNodes.map((node) => {
              return { ...node, style: { ...node.style, size: size.value } };
            }),
          ),
        );
      });
    });
  });

  describe('fill', () => {
    FILL.forEach((fill) => {
      it(`dispatches nodes update with ${fill.name} fill`, async () => {
        const { store, user } = renderWithProviders(
          <Panels selectedNodeIds={selectedNodeIdsArray} />,
          { preloadedState },
        );

        await user.click(screen.getByTestId(`${fill.value}-fill-button`));

        expect(store.dispatch).toHaveBeenCalledWith(
          canvasActions.updateNodes(
            selectedNodes.map((node) => {
              return { ...node, style: { ...node.style, fill: fill.value } };
            }),
          ),
        );
      });
    });
  });

  describe('line', () => {
    LINE.forEach((line) => {
      it(`dispatches nodes update with ${line.name} fill`, async () => {
        const { store, user } = renderWithProviders(
          <Panels selectedNodeIds={selectedNodeIdsArray} />,
          { preloadedState },
        );

        await user.click(screen.getByTestId(`${line.value}-line-button`));

        expect(store.dispatch).toHaveBeenCalledWith(
          canvasActions.updateNodes(
            selectedNodes.map((node) => {
              return { ...node, style: { ...node.style, line: line.value } };
            }),
          ),
        );
      });
    });
  });

  describe('animated', () => {
    it(`dispatches nodes update with new animated value`, async () => {
      const { store, user } = renderWithProviders(
        <Panels selectedNodeIds={selectedNodeIdsArray} />,
        { preloadedState },
      );

      await user.click(screen.getByTestId(/animated-toggle/));

      expect(store.dispatch).toHaveBeenCalledWith(
        canvasActions.updateNodes(
          selectedNodes.map((node) => {
            return { ...node, style: { ...node.style, animated: true } };
          }),
        ),
      );
    });
  });
});

describe('delete nodes button', () => {
  const preloadedState = stateGenerator({
    canvas: { present: { nodes, selectedNodeIds } },
  });

  it('toggles the disabled state base on selectedNodeIds', () => {
    const { rerender } = renderWithProviders(
      <Panels selectedNodeIds={selectedNodeIdsArray} />,
    );

    expect(screen.getByTestId(/delete-nodes-button/)).not.toBeDisabled();

    rerender(<Panels selectedNodeIds={[]} />);

    expect(screen.getByTestId(/delete-nodes-button/)).toBeDisabled();
  });

  it('dispatches deleteNodes with correct payload on click', async () => {
    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={selectedNodeIdsArray} />,
      {
        preloadedState,
      },
    );

    await user.click(screen.getByTestId(/delete-nodes-button/));

    expect(store.dispatch).toHaveBeenCalledWith(
      canvasActions.deleteNodes(selectedNodeIdsArray),
    );
  });
});

describe('history buttons', () => {
  it('disables undo history button when there is no past history', () => {
    const preloadedState = stateGenerator({ canvas: { past: [] } });

    renderWithProviders(<Panels selectedNodeIds={[]} />, { preloadedState });

    expect(screen.getByTestId(/undo-history-button/)).toBeDisabled();
  });

  it('disables redo history button when there is no future history', () => {
    const preloadedState = stateGenerator({ canvas: { future: [] } });

    renderWithProviders(<Panels selectedNodeIds={[]} />, { preloadedState });

    expect(screen.getByTestId(/redo-history-button/)).toBeDisabled();
  });

  it('dispatches undo history', async () => {
    const preloadedState = stateGenerator({
      canvas: { past: [{ ...initialCanvasState, nodes }] },
    });

    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={[]} />,
      {
        preloadedState,
      },
    );

    await user.click(screen.getByTestId(/undo-history-button/));

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.undo());
  });

  it('dispatches redo history', async () => {
    const preloadedState = stateGenerator({
      canvas: { future: [{ ...initialCanvasState, nodes }] },
    });

    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={[]} />,
      {
        preloadedState,
      },
    );

    await user.click(screen.getByTestId(/redo-history-button/));

    expect(store.dispatch).toHaveBeenCalledWith(historyActions.redo());
  });
});

describe('zoom panel', () => {
  it('disables zoom out when scale has reached min value', async () => {
    const preloadedState = stateGenerator({
      canvas: { present: { stageConfig: { scale: ZOOM_RANGE[0] } } },
    });

    renderWithProviders(<Panels selectedNodeIds={[]} />, { preloadedState });

    expect(screen.getByTestId(/zoom-out-button/)).toBeDisabled();
  });

  it('disables zoom in when scale has reached max value', async () => {
    const preloadedState = stateGenerator({
      canvas: { present: { stageConfig: { scale: ZOOM_RANGE[1] } } },
    });

    renderWithProviders(<Panels selectedNodeIds={[]} />, { preloadedState });

    expect(screen.getByTestId(/zoom-in-button/)).toBeDisabled();
  });

  it('disables zoom reset when scale is the default value', async () => {
    const preloadedState = stateGenerator({
      canvas: { present: { stageConfig: { scale: DEFAULT_ZOOM_VALUE } } },
    });

    renderWithProviders(<Panels selectedNodeIds={[]} />, { preloadedState });

    expect(screen.getByTestId(/zoom-reset-button/)).toBeDisabled();
  });

  it('zooms in', async () => {
    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={[]} />,
    );

    await user.click(screen.getByTestId(/zoom-in-button/));

    const state = store.getState().canvas.present;

    expect(state.stageConfig.scale).toBeGreaterThan(1);
  });

  it('zooms out', async () => {
    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={[]} />,
    );

    await user.click(screen.getByTestId(/zoom-out-button/));

    const state = store.getState().canvas.present;

    expect(state.stageConfig.scale).toBeLessThan(1);
  });

  it('resets zoom', async () => {
    const preloadedState = stateGenerator({
      canvas: { present: { stageConfig: { scale: 1.5 } } },
    });

    const { store, user } = renderWithProviders(
      <Panels selectedNodeIds={[]} />,
      {
        preloadedState,
      },
    );

    await user.click(screen.getByTestId(/zoom-reset-button/));

    const state = store.getState().canvas.present;

    expect(state.stageConfig.scale).toBe(1);
  });
});

describe('tools panel', () => {
  TOOLS.forEach((tool) => {
    it(`selects ${tool.value} tool`, async () => {
      const { user, store } = renderWithProviders(
        <Panels selectedNodeIds={[]} />,
      );

      await user.click(screen.getByTestId(`tool-button-${tool.value}`));

      expect(store.dispatch).toHaveBeenCalledWith(
        canvasActions.setToolType(tool.value),
      );
    });
  });
});

describe('when hand tool selected', () => {
  it('should not display: style panel, history buttons, nodes delete button', async () => {
    const preloadedState = stateGenerator({
      canvas: { present: { toolType: 'hand', nodes, selectedNodeIds } },
    });

    renderWithProviders(<Panels selectedNodeIds={selectedNodeIdsArray} />, {
      preloadedState,
    });

    expect(screen.queryByTestId(/style-panel/)).toBeNull();
    expect(screen.queryByTestId(/undo-history-button/)).toBeNull();
    expect(screen.queryByTestId(/redo-history-button/)).toBeNull();
    expect(screen.queryByTestId(/delete-nodes-button/)).toBeNull();
  });
});
