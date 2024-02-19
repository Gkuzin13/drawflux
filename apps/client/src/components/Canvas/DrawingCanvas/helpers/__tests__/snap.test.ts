import Konva from 'konva';
import {
  getLineGuideStops,
  getNearbySnaps,
  findClosestSnap,
  getObjectSnappingEdges,
  snapNodesToEdges,
} from '../snap';
import { renderScene } from '@/test/test-utils';
import type { SnapLineGuide, SnappingEdges, LineGuideStops } from '../snap';
import { act } from '@testing-library/react';

describe('getLineGuideStops', () => {
  const scene = renderScene();

  const rect = new Konva.Rect({
    id: 'rect',
    x: 50,
    y: 50,
    width: 50,
    height: 50,
  });
  const ellipse = new Konva.Ellipse({
    id: 'ellipse',
    x: 150,
    y: 150,
    radiusX: 100,
    radiusY: 100,
  });

  const rect2 = new Konva.Rect({
    id: 'rect2',
    x: 55,
    y: 75,
    width: 50,
    height: 20,
  });

  const transformer = new Konva.Transformer({ nodes: [rect, ellipse] });

  afterEach(() => {
    scene.layer.removeChildren();
    scene.destroy();
  });

  it('returns nodes vertical and horizontal guides', () => {
    scene.layer.add(rect, rect2, ellipse, transformer);
    scene.layer.batchDraw();

    const result = getLineGuideStops(transformer);

    // equals rect2 start, center, end stops
    expect(result.vertical).toEqual([55, 80, 105]);
    expect(result.horizontal).toEqual([75, 85, 95]);
  });

  it('returns empty line guide stops when theres no nodes on layer', () => {
    scene.layer.add(rect, ellipse, transformer);
    scene.layer.batchDraw();

    const result = getLineGuideStops(transformer);

    expect(result.vertical).toEqual([]);
    expect(result.horizontal).toEqual([]);
  });
});

describe('getObjectSnappingEdges', () => {
  it('returns correct snapping edges', () => {
    const scene = renderScene();

    const rect = new Konva.Rect({
      id: 'rect',
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    });
    const ellipse = new Konva.Ellipse({
      id: 'ellipse',
      x: 150,
      y: 150,
      radiusX: 100,
      radiusY: 100,
    });

    const transformer = new Konva.Transformer({ nodes: [rect, ellipse] });

    scene.layer.add(rect, ellipse, transformer);

    const result = getObjectSnappingEdges(transformer);

    expect(result.vertical).toEqual([
      { guide: 50, offset: 0, snap: 'start' },
      { guide: 150, offset: -100, snap: 'center' },
      { guide: 250, offset: -200, snap: 'end' },
    ]);
    expect(result.horizontal).toEqual([
      { guide: 50, offset: 0, snap: 'start' },
      { guide: 150, offset: -100, snap: 'center' },
      { guide: 250, offset: -200, snap: 'end' },
    ]);

    scene.layer.removeChildren();
    scene.destroy();
  });
});

describe('getNearbySnaps', () => {
  it('returns correct snaps', () => {
    const lineGuideStops: LineGuideStops = {
      vertical: [10, 30, 50],
      horizontal: [20, 40, 60],
    };
    const snapEdges: SnappingEdges = {
      vertical: [
        { guide: 15, offset: 5, snap: 'start' },
        { guide: 35, offset: 5, snap: 'center' },
        { guide: 55, offset: 5, snap: 'end' },
      ],
      horizontal: [
        { guide: 25, offset: 5, snap: 'start' },
        { guide: 45, offset: 5, snap: 'center' },
        { guide: 65, offset: 5, snap: 'end' },
      ],
    };

    const vertical = getNearbySnaps('vertical', lineGuideStops, snapEdges);
    const horizontal = getNearbySnaps('horizontal', lineGuideStops, snapEdges);

    expect(vertical).toEqual([
      {
        guide: 10,
        diff: 5,
        orientation: 'vertical',
        snap: 'start',
        offset: 5,
      },
      {
        guide: 30,
        diff: 5,
        orientation: 'vertical',
        snap: 'center',
        offset: 5,
      },
      {
        guide: 50,
        diff: 5,
        orientation: 'vertical',
        snap: 'end',
        offset: 5,
      },
    ]);
    expect(horizontal).toEqual([
      {
        guide: 20,
        diff: 5,
        orientation: 'horizontal',
        snap: 'start',
        offset: 5,
      },
      {
        guide: 40,
        diff: 5,
        orientation: 'horizontal',
        snap: 'center',
        offset: 5,
      },
      {
        guide: 60,
        diff: 5,
        orientation: 'horizontal',
        snap: 'end',
        offset: 5,
      },
    ]);
  });

  it('returns empty array if there are no snaps', () => {
    const emptyLineGuides: LineGuideStops = { vertical: [], horizontal: [] };
    const emptySnapEdges: SnappingEdges = { vertical: [], horizontal: [] };

    const vertical = getNearbySnaps(
      'vertical',
      emptyLineGuides,
      emptySnapEdges,
    );
    const horizontal = getNearbySnaps(
      'horizontal',
      emptyLineGuides,
      emptySnapEdges,
    );

    expect(vertical).toEqual([]);
    expect(horizontal).toEqual([]);
  });
});

describe('findClosestSnap', () => {
  it('finds the correct closest snap', () => {
    const snapLineGuides: SnapLineGuide[] = [
      {
        guide: 10,
        diff: 5,
        orientation: 'vertical',
        snap: 'start',
        offset: 5,
      },
      {
        guide: 30,
        diff: 2,
        orientation: 'vertical',
        snap: 'center',
        offset: 5,
      },
      {
        guide: 50,
        diff: 7,
        orientation: 'vertical',
        snap: 'end',
        offset: 5,
      },
    ];

    const result = findClosestSnap(snapLineGuides);

    expect(result).toEqual(snapLineGuides[1]);
  });

  it('returns null if there are no snaps', () => {
    const result = findClosestSnap([]);

    expect(result).toEqual(null);
  });
});

describe('snapNodesToEdges', () => {
  it('snaps nodes to vertical and horizontal edges', async () => {
    const scene = renderScene();

    const rect1 = new Konva.Rect({ x: 50, y: 50, width: 50, height: 50 });
    const rect2 = new Konva.Rect({ x: 110, y: 110, width: 20, height: 20 });
    const rect3 = new Konva.Rect({ x: 150, y: 150, width: 50, height: 50 });

    const transformer = new Konva.Transformer({ nodes: [rect2, rect3] });

    scene.layer.add(rect1, rect2, rect3, transformer);
    scene.layer.batchDraw();

    const lineGuides: SnapLineGuide[] = [
      {
        guide: 50,
        diff: 10,
        orientation: 'vertical',
        snap: 'center',
        offset: 20,
      },
      {
        guide: 50,
        diff: 10,
        orientation: 'horizontal',
        snap: 'end',
        offset: 20,
      },
    ];

    await act(async () => {
      snapNodesToEdges(lineGuides, transformer);
    })

    expect(rect2.absolutePosition()).toEqual({ x: 70, y: 70 });
    expect(rect3.absolutePosition()).toEqual({ x: 110, y: 110 });

    scene.layer.removeChildren();
    scene.destroy();
  });
});
