import type Konva from 'konva';
import { getLayerNodes } from './stage';

export type SnapAlignment = 'start' | 'center' | 'end';
export type Orientation = 'vertical' | 'horizontal';
export type SnapEdge = {
  guide: number;
  offset: number;
  snap: SnapAlignment;
};
export type SnapLineGuide = SnapEdge & {
  diff: number;
  orientation: Orientation;
};
export type LineGuideStops = Record<Orientation, number[]>;
export type SnappingEdges = Record<Orientation, SnapEdge[]>;

const GUIDELINE_OFFSET = 8;

// get all possible line guide stops
function getLineGuideStops(transformer: Konva.Transformer): LineGuideStops {
  const layer = transformer.getLayer() as Konva.Layer;

  const vertical: number[][] = [];
  const horizontal: number[][] = [];

  getLayerNodes(layer).forEach((node) => {
    if (
      node === transformer ||
      transformer.getNodes().some((n) => n === node)
    ) {
      return;
    }

    const box = node.getClientRect();

    vertical.push([box.x, box.x + box.width / 2, box.x + box.width]);
    horizontal.push([box.y, box.y + box.height / 2, box.y + box.height]);
  });

  return { vertical: vertical.flat(), horizontal: horizontal.flat() };
}

// get snapping edges of the transformer box
function getObjectSnappingEdges(transformer: Konva.Transformer): SnappingEdges {
  const box = transformer.__getNodeRect();
  const absPosition = transformer.getAbsolutePosition();

  return {
    vertical: [
      {
        guide: Math.round(box.x),
        offset: Math.round(absPosition.x - box.x),
        snap: 'start',
      },
      {
        guide: Math.round(box.x + box.width / 2),
        offset: Math.round(absPosition.x - box.x - box.width / 2),
        snap: 'center',
      },
      {
        guide: Math.round(box.x + box.width),
        offset: Math.round(absPosition.x - box.x - box.width),
        snap: 'end',
      },
    ],
    horizontal: [
      {
        guide: Math.round(box.y),
        offset: Math.round(absPosition.y - box.y),
        snap: 'start',
      },
      {
        guide: Math.round(box.y + box.height / 2),
        offset: Math.round(absPosition.y - box.y - box.height / 2),
        snap: 'center',
      },
      {
        guide: Math.round(box.y + box.height),
        offset: Math.round(absPosition.y - box.y - box.height),
        snap: 'end',
      },
    ],
  };
}

function getNearbySnaps(
  orientation: Orientation,
  lineGuideStops: LineGuideStops,
  transformerSnapEdges: SnappingEdges,
) {
  const result: SnapLineGuide[] = [];

  lineGuideStops[orientation].forEach((guide) => {
    transformerSnapEdges[orientation].forEach((edge) => {
      const diff = Math.abs(guide - edge.guide);

      if (diff < GUIDELINE_OFFSET) {
        result.push({
          guide,
          diff,
          orientation,
          snap: edge.snap,
          offset: edge.offset,
        });
      }
    });
  });

  return result;
}

export function getLineGuides(transformer: Konva.Transformer) {
  const lineGuideStops = getLineGuideStops(transformer);
  const snapEdges = getObjectSnappingEdges(transformer);

  const vertical = getNearbySnaps('vertical', lineGuideStops, snapEdges);
  const horizontal = getNearbySnaps('horizontal', lineGuideStops, snapEdges);

  const minVertical = findClosestSnap(vertical);
  const minHorizontal = findClosestSnap(horizontal);

  const guides: SnapLineGuide[] = [];

  if (minVertical) {
    guides.push(minVertical);
  }

  if (minHorizontal) {
    guides.push(minHorizontal);
  }

  return guides;
}

export function snapNodesToEdges(
  lineGuides: SnapLineGuide[],
  transformer: Konva.Transformer,
) {
  const nodes = transformer.getNodes();
  const trPos = transformer.absolutePosition();

  nodes.forEach((node) => {
    const absPosition = node.absolutePosition();
    const diff = { x: absPosition.x - trPos.x, y: absPosition.y - trPos.y };

    lineGuides.forEach((lineGuide) => {
      switch (lineGuide.snap) {
        case 'start': {
          switch (lineGuide.orientation) {
            case 'vertical': {
              absPosition.x = diff.x + lineGuide.guide + lineGuide.offset;
              break;
            }
            case 'horizontal': {
              absPosition.y = diff.y + lineGuide.guide + lineGuide.offset;
              break;
            }
          }
          break;
        }
        case 'center': {
          switch (lineGuide.orientation) {
            case 'vertical': {
              absPosition.x = diff.x + lineGuide.guide + lineGuide.offset;
              break;
            }
            case 'horizontal': {
              absPosition.y = diff.y + lineGuide.guide + lineGuide.offset;
              break;
            }
          }
          break;
        }
        case 'end': {
          switch (lineGuide.orientation) {
            case 'vertical': {
              absPosition.x = diff.x + lineGuide.guide + lineGuide.offset;
              break;
            }
            case 'horizontal': {
              absPosition.y = diff.y + lineGuide.guide + lineGuide.offset;
              break;
            }
          }
          break;
        }
      }
    });

    node.absolutePosition(absPosition);
  });
}

function findClosestSnap(lineGuides: SnapLineGuide[]) {
  return lineGuides.sort((a, b) => a.diff - b.diff)[0];
}
