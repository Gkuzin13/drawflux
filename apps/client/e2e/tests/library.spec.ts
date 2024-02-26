import { test, expect } from '@playwright/test';
import { LOCAL_STORAGE_LIBRARY_KEY } from '@/constants/app';
import { DRAWING_CANVAS } from '@/constants/canvas';
import { createNode } from '@/utils/node';
import { drawShape, getDrawingCanvas } from 'e2e/utils/canvas';
import type Konva from 'konva';
import type { Library } from '@/constants/app';

test.describe('library', async () => {
  const ellipse = createNode('ellipse', [600, 600]);
  ellipse.nodeProps.width = 50;
  ellipse.nodeProps.height = 50;

  const rect = createNode('rectangle', [400, 400]);
  rect.nodeProps.width = 50;
  rect.nodeProps.height = 50;

  const library: Library = {
    items: [
      { id: '1', created: Date.now(), elements: [ellipse] },
      { id: '2', created: Date.now(), elements: [rect] },
    ],
  };

  const preloadedLibrary = {
    key: LOCAL_STORAGE_LIBRARY_KEY,
    value: JSON.stringify(library),
  };

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      ({ key, value }) => localStorage.setItem(key, value),
      preloadedLibrary,
    );

    await page.goto('/');
  });

  test('loads library state from localStorage', async ({ page }) => {
    await page.getByTestId('library-drawer-trigger').click();

    await expect(page.getByTestId('library-item').first()).toBeVisible();
    await expect(page.getByTestId('library-item').nth(1)).toBeVisible();
    await expect(page.getByTestId('library-item')).toHaveCount(2);
  });

  test('adds items to the library', async ({ page }) => {
    await drawShape(
      page,
      [
        [500, 500],
        [550, 550],
      ],
      { type: 'rectangle' },
    );

    // open context menu
    await getDrawingCanvas(page).click({
      button: 'right',
      position: { x: 500, y: 500 },
    });

    await page.getByText('Add To Library').click();

    await page.getByTestId('library-drawer-trigger').click();

    const storedLibrary: Library = await page.evaluate(
      (key) => JSON.parse(window.localStorage.getItem(key) as string),
      LOCAL_STORAGE_LIBRARY_KEY,
    );

    expect(storedLibrary.items).toHaveLength(3);
    await expect(page.getByTestId('library-item').first()).toBeVisible();
    await expect(page.getByTestId('library-item').nth(1)).toBeVisible();
    await expect(page.getByTestId('library-item').nth(2)).toBeVisible();
    await expect(page.getByTestId('library-item')).toHaveCount(3);
    await expect(page.getByText('Empty here...')).toBeHidden();
  });

  test('removes items from library', async ({ page }) => {
    await page.getByTestId('library-drawer-trigger').click();

    for (const item of await page.getByTestId('library-item').all()) {
      await item.hover();
      await item.getByRole('checkbox').check();
    }

    await page.getByTestId('remove-library-items-button').click();


    const storedLibrary: Library = await page.evaluate(
      (key) => JSON.parse(window.localStorage.getItem(key) as string),
      LOCAL_STORAGE_LIBRARY_KEY,
    );

    expect(storedLibrary.items).toHaveLength(0);
    await expect(page.getByText('Empty here...')).toBeVisible();
    await expect(page.getByTestId('library-item')).toHaveCount(0);
    await expect(page.getByTestId('library-item')).toBeHidden();
  });

  // [TODO]: need better way to get all shapes
  test('drag-n-drop items to canvas', async ({ page }) => {
    await page.getByTestId('library-drawer-trigger').click();

    await page
      .getByTestId('library-item')
      .first()
      .dragTo(getDrawingCanvas(page), { targetPosition: { x: 200, y: 200 } });

    await page
      .getByTestId('library-item')
      .nth(1)
      .dragTo(getDrawingCanvas(page), { targetPosition: { x: 400, y: 400 } });

    const shapes = await page.evaluate((name) => {
      const drawingCanvas = window.Konva.stages.find(
        (stage) => stage.name() === name,
      );

      // eslint-disable-next-line playwright/no-unsafe-references
      return drawingCanvas?.find((node: Konva.Node) => Boolean(node.id()));
    }, DRAWING_CANVAS.NAME);

    expect(shapes).toHaveLength(2);
  });

  test('adds items to canvas on click', async ({ page }) => {
    await page.getByTestId('library-drawer-trigger').click();

    await page.getByTestId('library-item').first().click();
    await page.getByTestId('library-item').nth(1).click();

    const shapes = await page.evaluate((name) => {
      const drawingCanvas = window.Konva.stages.find(
        (stage) => stage.name() === name,
      );

      // eslint-disable-next-line playwright/no-unsafe-references
      return drawingCanvas?.find((node: Konva.Node) => Boolean(node.id()));
    }, DRAWING_CANVAS.NAME);

    expect(shapes).toHaveLength(2);
  });
});
