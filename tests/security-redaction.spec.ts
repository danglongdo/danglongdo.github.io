import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('Security Redaction & Confidentiality Suite', () => {
  const allRoutes = [
    '/',
    '/vi',
    '/projects/nal-ai-automation-erp',
    '/projects/sep490-construction-slms',
    '/projects/codelearn-community-content',
    '/vi/projects/nal-ai-automation-erp',
    '/vi/projects/sep490-construction-slms',
    '/vi/projects/codelearn-community-content',
    '/404',
    '/vi/404',
  ];

  test('QA happy scenario: asserts zero clickable links to sep490-backend across all live browser routes', async ({
    page,
  }) => {
    for (const route of allRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500);

      const links = await page.locator('a[href]').evaluateAll((anchors) =>
        anchors.map((a) => a.getAttribute('href') || '')
      );

      const violatingLinks = links.filter((href) =>
        href.toLowerCase().includes('github.com/lombeo/sep490-backend')
      );

      expect(
        violatingLinks,
        `Found forbidden clickable link(s) to sep490-backend on route "${route}": ${violatingLinks.join(', ')}`
      ).toHaveLength(0);
    }
  });

  test('verifies SEP490 case study renders security advisory instead of direct repo link', async ({ page }) => {
    await page.goto('/projects/sep490-construction-slms');
    const enNotice = page.locator('aside[role="note"]');
    await expect(enNotice).toBeVisible();
    await expect(enNotice).toContainText('Direct repository links are temporarily restricted');

    const enLinks = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => a.getAttribute('href') || '')
    );
    expect(enLinks.some((href) => href.includes('sep490-backend'))).toBe(false);

    await page.goto('/vi/projects/sep490-construction-slms');
    const viNotice = page.locator('aside[role="note"]');
    await expect(viNotice).toBeVisible();
    await expect(viNotice).toContainText('Liên kết kho mã nguồn tạm thời được hạn chế');

    const viLinks = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((a) => a.getAttribute('href') || '')
    );
    expect(viLinks.some((href) => href.includes('sep490-backend'))).toBe(false);
  });

  test('verifies NAL Enterprise case study displays NDA compliance banner in both locales', async ({ page }) => {
    await page.goto('/projects/nal-ai-automation-erp');
    const enNda = page.locator('aside[role="note"]');
    await expect(enNda).toBeVisible();
    await expect(enNda).toContainText('Non-Disclosure Agreement');

    await page.goto('/vi/projects/nal-ai-automation-erp');
    const viNda = page.locator('aside[role="note"]');
    await expect(viNda).toBeVisible();
    await expect(viNda).toContainText('thoả thuận bảo mật (NDA)');
  });

  test('scans all static files in dist/ to guarantee zero unredacted backend links or leaked secrets', async () => {
    const distDir = path.resolve(process.cwd(), 'dist');
    expect(fs.existsSync(distDir), 'dist/ directory must exist for static scan').toBe(true);

    function collectFiles(dir: string): string[] {
      const files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...collectFiles(fullPath));
        } else if (/\.(html|js|css)$/i.test(entry.name)) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const staticFiles = collectFiles(distDir);
    expect(staticFiles.length).toBeGreaterThan(0);

    const forbiddenPatterns = [
      /href=["'][^"']*github\.com\/lombeo\/sep490-backend[^"']*["']/i,
      /postgres:\/\/postgres:[^@\s"']+@/i,
      /AKIA[0-9A-Z]{16}/,
      /-----BEGIN RSA PRIVATE KEY-----/,
    ];

    for (const filePath of staticFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath);

      for (const pattern of forbiddenPatterns) {
        const match = content.match(pattern);
        expect(
          match,
          `Security violation: found forbidden sensitive pattern ${pattern} in static build file "${relPath}"`
        ).toBeNull();
      }
    }
  });

  test('QA failure scenario: detects mock forbidden link string when simulated', () => {
    const mockViolatingHtml = '<a href="https://github.com/lombeo/sep490-backend">Source Code</a>';
    const hasForbiddenLink = /href=["'][^"']*github\.com\/lombeo\/sep490-backend[^"']*["']/i.test(
      mockViolatingHtml
    );
    expect(hasForbiddenLink).toBe(true);
  });
});
