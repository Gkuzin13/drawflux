import Konva from 'konva';
import { waitFor } from '@testing-library/react';
import { stateGenerator } from '@/test/data-generators';
import { renderWithProviders } from '@/test/test-utils';
import { createNode } from '@/utils/node';
import DrawingCanvas from './DrawingCanvas';
import { noop } from '@/utils/is';
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

  it('renders shapes', async () => {
    const nodes = [arrow, rectangle, ellipse, draw, text];
    const preloadedState = stateGenerator({ canvas: { present: { nodes } } });

    renderWithProviders(
      <DrawingCanvas
        size={{ width: window.innerWidth, height: window.innerHeight }}
        onNodesSelect={noop}
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
});
