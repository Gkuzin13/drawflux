import type { ShapesThumbnailStyle } from '@/components/Elements/ShapesThumbnail/ShapesThumbnail';

export const LIBRARY = {
  dataTransferFormat: 'json/library-item',
} as const;

export const LIBRARY_ITEM: { style: Partial<ShapesThumbnailStyle> } = {
  style: {
    width: 54,
    height: 54,
    padding: 2,
    shapesScale: 1.5,
  },
} as const;
