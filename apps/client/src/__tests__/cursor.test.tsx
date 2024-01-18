import App from '@/App';
import { TOOLS } from '@/constants/panels';
import { ARROW_TRANSFORMER } from '@/constants/shape';
import { stateGenerator } from '@/test/data-generators';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import { createNode } from '@/utils/node';
import { screen, waitFor } from '@testing-library/react';
import Konva from 'konva';
import type { NodeType } from 'shared';

const nodeTypes: NodeType[] = [
  'arrow',
  'draw',
  'ellipse',
  'laser',
  'rectangle',
  'text',
];

const nodeTools = TOOLS.filter((tool) =>
  nodeTypes.includes(tool.value as NodeType),
);

describe('cursor', () => {
  describe('initial', () => {
    it('"default" when tool type is select', async () => {
      renderWithProviders(<App />);

      const { container } = await findCanvas();

      expect(container.style.cursor).toBe('');
    });

    it('"grab" when tool type is hand', async () => {
      const preloadedState = stateGenerator({
        canvas: { present: { toolType: 'hand' } },
      });

      renderWithProviders(<App />, { preloadedState });

      const { container } = await findCanvas();

      expect(container.style.cursor).toBe('grab');
    });

    nodeTypes.forEach((type) => {
      it(`"crosshair" when tool type is ${type}`, async () => {
        const preloadedState = stateGenerator({
          canvas: { present: { toolType: type } },
        });

        renderWithProviders(<App />, { preloadedState });

        const { container } = await findCanvas();

        expect(container.style.cursor).toBe('crosshair');
      });
    });
  });

  describe('tool type shortcuts', () => {
    it('"grab" on hand tool', async () => {
      const { user } = renderWithProviders(<App />);

      const { container } = await findCanvas();

      await user.keyboard('h');

      expect(container.style.cursor).toBe('grab');
    });

    it('"default" on select tool', async () => {
      const preloadedState = stateGenerator({
        canvas: { present: { toolType: 'hand' } },
      });

      const { user } = renderWithProviders(<App />, { preloadedState });

      const { container } = await findCanvas();

      await user.keyboard('v');

      expect(container.style.cursor).toBe('');
    });

    nodeTools.forEach((tool) => {
      it(`crosshair on ${tool.value} tool`, async () => {
        const { user } = renderWithProviders(<App />);

        const { container } = await findCanvas();

        await user.keyboard(tool.key);

        expect(container.style.cursor).toBe('crosshair');
      });
    });
  });

  describe('tools panel selection', () => {
    it('"grab" on hand tool', async () => {
      const { user } = renderWithProviders(<App />);

      const { container } = await findCanvas();

      await user.click(screen.getByTestId(/tool-button-hand/));

      expect(container.style.cursor).toBe('grab');
    });

    it('"default" on select tool', async () => {
      const { user } = renderWithProviders(<App />);

      const { container } = await findCanvas();

      await user.click(screen.getByTestId(/tool-button-select/));

      expect(container.style.cursor).toBe('');
    });

    nodeTools.forEach((tool) => {
      it(`"crosshair" on ${tool.value} tool`, async () => {
        const { user } = renderWithProviders(<App />);

        const { container } = await findCanvas();

        await user.click(
          screen.getByTestId(new RegExp(`tool-button-${tool.value}`)),
        );

        expect(container.style.cursor).toBe('crosshair');
      });
    });
  });

  describe('canvas interactions', () => {
    it('hand tool: "grabbing" on dragStart and back to "grab" on dragEnd', async () => {
      const preloadedState = stateGenerator({
        canvas: { present: { toolType: 'hand' } },
      });

      renderWithProviders(<App />, { preloadedState });

      const { container } = await findCanvas();

      // fire dragStart event
      Konva.stages[0].fire('dragstart');

      expect(container.style.cursor).toBe('grabbing');

      // fire dragEnd event
      Konva.stages[0].fire('dragend');

      expect(container.style.cursor).toBe('grab');
    });

    it('select tool: "all-scroll" on dragStart and back to "default" on dragEnd', async () => {
      const preloadedState = stateGenerator({
        canvas: { present: { toolType: 'select' } },
      });

      renderWithProviders(<App />, { preloadedState });

      const { container } = await findCanvas();

      // fire dragStart event
      Konva.stages[0].fire('dragstart');

      expect(container.style.cursor).toBe('all-scroll');

      // fire dragEnd event
      Konva.stages[0].fire('dragend');

      expect(container.style.cursor).toBe('');
    });

    it('arrow transformer: "grabbing" on dragStart and back to "grab" on dragEnd', async () => {
      const arrowNode = createNode('arrow', [20, 30]);
      arrowNode.nodeProps.points = [[40, 50]];

      const preloadedState = stateGenerator({
        canvas: {
          present: {
            toolType: 'select',
            nodes: [arrowNode],
            selectedNodeIds: { [arrowNode.nodeProps.id]: true },
          },
        },
      });

      renderWithProviders(<App />, { preloadedState });

      const { container } = await findCanvas();

      const stage = Konva.stages[0];

      await waitFor(() => {
        const arrowTransformerAnchor = stage.findOne(
          `.${ARROW_TRANSFORMER.ANCHOR_NAME}`,
        );

        // fire dragStart event
        arrowTransformerAnchor?.fire('dragstart', undefined, true);

        expect(container.style.cursor).toBe('grabbing');

        // fire dragStart event
        arrowTransformerAnchor?.fire('dragend', undefined, true);

        expect(container.style.cursor).toBe('grab');
      });
    });
  });
});
