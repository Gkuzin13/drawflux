/**
 * @vitest-environment happy-dom
 */
import Konva from 'konva';
import { fireEvent, waitFor } from '@testing-library/react';
import { stateGenerator } from '@/test/data-generators';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import { createNode } from '@/utils/node';
import DrawingCanvas from './DrawingCanvas';
import { getLayerNodes, getMainLayer } from './helpers/stage';

/**
 * [TODO]: implement canvas tests
 */
describe('DrawingCanvas', () => {
  const arrow = createNode('arrow', [10, 10]);
  arrow.nodeProps.points = [[20, 20]];

  const rectangle = createNode('rectangle', [30, 30]);
  rectangle.nodeProps.width = 20;
  rectangle.nodeProps.height = 20;

  const ellipse = createNode('ellipse', [60, 60]);
  ellipse.nodeProps.width = 20;
  ellipse.nodeProps.height = 20;

  const draw = createNode('draw', [90, 90]);
  draw.nodeProps.points = [
    [100, 100],
    [120, 120],
  ];

  const text = createNode('text', [120, 120]);
  text.text = 'Hello World';

  const nodes = [arrow, rectangle, ellipse, draw, text];

  it('renders shapes', async () => {
    const preloadedState = stateGenerator({ canvas: { present: { nodes } } });

    renderWithProviders(
      <DrawingCanvas
        width={window.innerWidth}
        height={window.innerHeight}
        onNodesSelect={() => vi.fn()}
      />,
      { preloadedState },
    );

    await waitFor(() => {
      const stage = Konva.stages[0];
      const layer = getMainLayer(stage);
      const layerNodes = getLayerNodes(layer);

      expect(layerNodes).toHaveLength(5);

      expect(
        layerNodes.every((layerNode) => {
          return nodes.find((node) => node.nodeProps.id === layerNode.id());
        }),
      );
    });
  });

  it('inherits style from currentNodeStyle', async () => {
    const preloadedState = stateGenerator({
      canvas: {
        present: {
          toolType: 'rectangle',
          currentNodeStyle: {
            color: 'blue700',
            line: 'dashed',
            fill: 'solid',
            opacity: 0.5,
            animated: true,
          },
        },
      },
    });

    const { store } = renderWithProviders(
      <DrawingCanvas
        width={window.innerWidth}
        height={window.innerHeight}
        onNodesSelect={() => vi.fn()}
      />,
      { preloadedState },
    );

    const { canvas } = await findCanvas();

    // start at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });

    // move to [30, 40]
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40 });

    // stop at last position
    fireEvent.pointerUp(canvas);

    await waitFor(() => {
      const canvasState = store.getState().canvas.present;
      const node = canvasState.nodes[0];

      expect(node.style).toEqual(
        preloadedState.canvas.present.currentNodeStyle,
      );
    });
  });
});
