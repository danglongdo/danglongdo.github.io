import { test, expect } from '@playwright/test';

test.describe('Resume PDF Endpoint & Download Flow', () => {
  test('should resolve /resume.pdf with HTTP 200 and Content-Type application/pdf', async ({ request }) => {
    const response = await request.get('/resume.pdf');

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/pdf');

    const body = await response.body();
    expect(body.length).toBeGreaterThan(1024);

    // Verify PDF magic bytes
    const magicHeader = body.subarray(0, 5).toString('latin1');
    expect(magicHeader).toBe('%PDF-');
  });

  test('should verify Download CV links on homepage resolve to valid resume endpoint', async ({ page }) => {
    await page.goto('/');

    // Find links pointing to /resume.pdf
    const resumeLinks = page.locator('a[href="/resume.pdf"]');
    const count = await resumeLinks.count();
    expect(count).toBeGreaterThan(0);

    // First resume link should have proper security attributes
    const firstLink = resumeLinks.first();
    const target = await firstLink.getAttribute('target');
    const rel = await firstLink.getAttribute('rel');
    expect(target).toBe('_blank');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });
});
