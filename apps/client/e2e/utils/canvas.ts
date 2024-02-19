import { DRAWING_CANVAS } from '@/constants/canvas';
import type { Page } from '@playwright/test';
import type { NodeType, Point } from 'shared';

type DrawPosition = [start: Point, end: Point];

type CreateShapeOptions = {
  type: Omit<NodeType, 'text'>;
  unselect?: boolean;
};

export async function draw(page: Page, [start, end]: DrawPosition) {
  await page.mouse.move(start[0], start[1]);
  await page.mouse.down();
  await page.mouse.move(end[0], end[1]);
  await page.mouse.up();
}

export async function createShape(
  page: Page,
  position: DrawPosition,
  options: CreateShapeOptions = {
    type: 'rectangle',
  },
) {
  await page.getByTestId(`tool-button-${options.type}`).click();
  await draw(page, position);
}

export function getDrawingCanvas(page: Page) {
  return page.locator(`.${DRAWING_CANVAS.CONTAINER_CLASS}`).locator('canvas');
}
