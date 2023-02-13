import { test, expect } from '@playwright/test';

test('Go to homepage', async ({ page }) => {
  await page.goto('http://localhost:3000');


});