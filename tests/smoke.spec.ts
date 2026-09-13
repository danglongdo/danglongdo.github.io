import { test, expect } from '@playwright/test';

test.describe('Smoke Test Suite', () => {
  test('should load the homepage with HTTP 200 and display candidate name', async ({ page }) => {
    const response = await page.goto('/');

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Đỗ Đăng Long/);
    await expect(page.locator('h1')).toContainText('Đỗ Đăng Long');
  });
});
