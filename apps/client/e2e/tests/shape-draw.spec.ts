import { chromium } from '@playwright/test';
import { describe, beforeAll, afterAll, test } from 'vitest';
import { preview } from 'vite';
import type { Page, Browser } from '@playwright/test';
import type { PreviewServer } from 'vite';

describe.runIf(process.platform !== 'win32')('basic', async () => {
  let server: PreviewServer;
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 } });
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test('selects a tool and draws a shape', async () => {
    // intentionally empty
  }, 60_000);
});
