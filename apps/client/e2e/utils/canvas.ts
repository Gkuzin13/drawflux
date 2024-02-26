import { DRAWING_CANVAS } from '@/constants/canvas';
import type { Page } from '@playwright/test';
import type { NodeType, Point } from 'shared';

type DrawPoints = [start: Point, end: Point];
type DrawShapeOptions = {
  type: Exclude<NodeType, 'text'>;
  unselect?: boolean;
};
type CreateTextOptions = {
  text: string;
  unselect?: boolean;
};

export async function draw(page: Page, [start, end]: DrawPoints) {
  await page.mouse.move(start[0], start[1]);
  await page.mouse.down();
  await page.mouse.move(end[0], end[1], { steps: 2 });
  await page.mouse.up();
}

export async function drawShape(
  page: Page,
  points: DrawPoints,
  options: DrawShapeOptions = { type: 'rectangle' },
) {
  await page.getByTestId(`tool-button-${options.type}`).click();
  await draw(page, points);

  if (options.unselect) {
    await getDrawingCanvas(page).click({ position: { x: 0, y: 0 } });
  }
}

export async function createText(
  page: Page,
  point: Point,
  options: CreateTextOptions,
) {
  await page.getByTestId('tool-button-text').click();
  await getDrawingCanvas(page).click({
    position: { x: point[0], y: point[1] },
  });
  
  if (options.unselect) {
    await getDrawingCanvas(page).click({ position: { x: 0, y: 0 } });
  }
}

export function getDrawingCanvas(page: Page) {
  return page.locator(`.${DRAWING_CANVAS.CONTAINER_CLASS}`).locator('canvas');
}
