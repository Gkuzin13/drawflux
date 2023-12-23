import { nodesGenerator } from '@/test/data-generators';
import ShapesThumbnail from './ShapesThumbnail';
import { renderWithProviders } from '@/test/test-utils';

describe('ShapesThumbnail', () => {
  it('applies draggable attribute to canvas', async () => {
    const nodes = nodesGenerator(3);

    const { container } = renderWithProviders(
      <ShapesThumbnail nodes={nodes} draggable />,
    );

    const thumbnailCanvas = container.querySelector(
      'canvas',
    ) as HTMLCanvasElement;

    expect(thumbnailCanvas).toHaveAttribute('draggable', 'true');
  });
});
