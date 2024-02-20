import { test, expect } from '@playwright/test';
import { drawShape, getDrawingCanvas } from 'e2e/utils/canvas';

test.describe('context menu', async () => {
  test('opens canvas menu when right clicking on empty', async ({ page }) => {
    await page.goto('/');

    await getDrawingCanvas(page).click({
      button: 'right',
      position: { x: 400, y: 450 },
    });
    
    await expect(page.getByTestId('context-menu')).toBeVisible();
    await expect(page.getByTestId('style-panel')).toBeHidden();
  });
  
  test('opens node menu when right clicking on a shape', async ({
    page,
  }) => {
    await page.goto('/');

    await drawShape(page, [
      [400, 450],
      [450, 500],
    ]);

    await getDrawingCanvas(page).click({
      button: 'right',
      position: { x: 400, y: 450 },
    });

    await expect(page.getByTestId('context-menu')).toBeVisible();
    await expect(page.getByTestId('style-panel')).toBeVisible();
  });
});
