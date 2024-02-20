import { ZOOM } from '@/constants/panels';
import { test, expect } from '@playwright/test';
import { createText } from 'e2e/utils/canvas';

test.describe('context menu', async () => {
  test('prevents zoom when over a text node', async ({ page }) => {
    await page.goto('/');

    await createText(page, [400, 450], { text: 'hello' });
    
    // zoom in/out at text position (400, 450) 
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, -10);
    await page.mouse.wheel(0, -20);
    await page.mouse.wheel(0, 30);
    await page.mouse.wheel(0, 40);

    await expect(page.getByTitle(ZOOM.reset.name)).toHaveText('100%');
  });
});
