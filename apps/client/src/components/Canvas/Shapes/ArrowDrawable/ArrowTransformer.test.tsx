import Konva from 'konva';
import { Layer, Stage } from 'react-konva';
import { findCanvas, renderWithProviders } from '@/test/test-utils';
import ArrowTransformer from './ArrowTransformer';
import { ARROW_TRANSFORMER } from '@/constants/shape';

describe('ArrowTransformer', () => {
  describe('cursor', () => {
    it('grab on transformer anchor hover', async () => {
      renderWithProviders(
        <Stage>
          <Layer>
            <ArrowTransformer
              start={[20, 30]}
              end={[40, 50]}
              bendPoint={[30, 40]}
              bendMovement={{ min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }}
              stageScale={1}
              onTranformStart={vi.fn}
              onTransform={vi.fn}
              onTransformEnd={vi.fn}
            />
          </Layer>
        </Stage>,
      );

      const { container } = await findCanvas();

      const arrowTransformerAnchor = Konva.stages[0].findOne(
        `.${ARROW_TRANSFORMER.ANCHOR_NAME}`,
      );

      arrowTransformerAnchor?.fire('mouseenter');

      expect(container.style.cursor).toBe('grab');

      arrowTransformerAnchor?.fire('mouseleave');

      expect(container.style.cursor).toBe('');
    });
  });
});
