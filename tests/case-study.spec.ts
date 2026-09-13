import { test, expect } from '@playwright/test';

test.describe('Case Study Template Suite', () => {
  test('QA happy scenario: renders full English case study for nal-ai-automation-erp', async ({ page }) => {
    const response = await page.goto('/projects/nal-ai-automation-erp');
    expect(response?.status()).toBe(200);

    // H1 Project Title
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Enterprise Workflow Automation with AI Agents');

    // Breadcrumb / Back to projects link
    const backLink = page.locator('nav[aria-label="Breadcrumbs"] a');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Back to Projects');
    expect(await backLink.getAttribute('href')).toBe('/#projects');

    // Rendered markdown headings
    const execHeading = page.locator('h2', { hasText: 'Executive Overview' });
    await expect(execHeading).toBeVisible();

    // Architecture flow diagram block in pre
    const preBlock = page.locator('pre');
    await expect(preBlock.first()).toBeVisible();
    await expect(preBlock.first()).toContainText('Mattermost');

    // Structural takeaways section
    const takeaways = page.locator('#takeaways-heading');
    await expect(takeaways).toBeVisible();

    const archHeading = page.locator('#architecture-diagram-heading');
    await expect(archHeading).toBeVisible();
    await expect(archHeading).toContainText('System Architecture & Data Flow');

    // Confidentiality Notice banner
    const ndaNotice = page.locator('aside[role="note"]');
    await expect(ndaNotice).toBeVisible();
    await expect(ndaNotice).toContainText('Non-Disclosure Agreement');

    // Next project link in pagination
    const nextLink = page.locator('nav[aria-label="Project Navigation"] a');
    await expect(nextLink.first()).toBeVisible();
  });

  test('QA happy scenario: renders full Vietnamese case study for nal-ai-automation-erp', async ({ page }) => {
    const response = await page.goto('/vi/projects/nal-ai-automation-erp');
    expect(response?.status()).toBe(200);

    // H1 Project Title in Vietnamese
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('Tự động hoá Quy trình Doanh nghiệp');

    // Breadcrumb in Vietnamese
    const backLink = page.locator('nav[aria-label="Breadcrumbs"] a');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Quay lại dự án');
    expect(await backLink.getAttribute('href')).toBe('/vi#projects');

    // Confidentiality Notice in Vietnamese
    const ndaNotice = page.locator('aside[role="note"]');
    await expect(ndaNotice).toBeVisible();
    await expect(ndaNotice).toContainText('thoả thuận bảo mật (NDA)');

    const archHeading = page.locator('#architecture-diagram-heading');
    await expect(archHeading).toBeVisible();
    await expect(archHeading).toContainText('Kiến trúc Hệ thống & Luồng Dữ liệu');
  });

  test('QA failure scenario: request non-existent project slug returns 404', async ({ page }) => {
    const response = await page.goto('/projects/unknown-project');
    expect(response?.status()).toBe(404);
  });

  test('QA security check: sep490 case study contains no clickable links to sep490-backend', async ({ page }) => {
    const response = await page.goto('/projects/sep490-construction-slms');
    expect(response?.status()).toBe(200);

    const allLinks = await page.locator('a').evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('href')).filter(Boolean)
    );

    const hasRestrictedLink = allLinks.some((href) => href?.includes('github.com/lombeo/sep490-backend'));
    expect(hasRestrictedLink).toBe(false);
  });
});
