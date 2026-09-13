import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Custom 404 Error Pages', () => {
  const enAstroPath = join(process.cwd(), 'src/pages/404.astro');
  const viAstroPath = join(process.cwd(), 'src/pages/vi/404.astro');
  const enDistPath = join(process.cwd(), 'dist/404.html');
  const viDistPath = join(process.cwd(), 'dist/vi/404/index.html');

  it('verifies that 404 Astro source pages exist for both locales', () => {
    assert.equal(existsSync(enAstroPath), true, 'src/pages/404.astro must exist');
    assert.equal(existsSync(viAstroPath), true, 'src/pages/vi/404.astro must exist');
  });

  it('verifies that built static HTML files exist in dist', () => {
    assert.equal(existsSync(enDistPath), true, 'dist/404.html must be generated');
    assert.equal(existsSync(viDistPath), true, 'dist/vi/404/index.html must be generated');
  });

  it('QA happy scenario: English 404 renders headline, description, header, footer, and navigation links', () => {
    const html = readFileSync(enDistPath, 'utf-8');

    assert.match(html, /<html lang="en"/);
    assert.match(html, /<title>404: Page Not Found/);
    assert.match(html, /Page Not Found/);
    assert.match(html, /The page you are looking for does not exist or has been moved\./);
    assert.match(html, /<header/);
    assert.match(html, /<footer/);

    assert.match(html, /href="\/"[^>]*>[\s\S]*?Back to Homepage/);
    assert.match(html, /href="\/#projects"[^>]*>[\s\S]*?View Projects/);

    assert.match(html, /focus-visible:ring-2/);
    assert.match(html, /focus-visible:ring-accent/);
  });

  it('Vietnamese 404 renders localized headline, description, header, footer, and /vi navigation links', () => {
    const html = readFileSync(viDistPath, 'utf-8');

    assert.match(html, /<html lang="vi"/);
    assert.match(html, /<title>404: Không tìm thấy trang/);
    assert.match(html, /Không tìm thấy trang/);
    assert.match(html, /Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển\./);
    assert.match(html, /<header/);
    assert.match(html, /<footer/);

    assert.match(html, /href="\/vi"[^>]*>[\s\S]*?Quay về trang chủ/);
    assert.match(html, /href="\/vi#projects"[^>]*>[\s\S]*?Xem dự án/);

    assert.match(html, /focus-visible:ring-2/);
    assert.match(html, /focus-visible:ring-accent/);
  });

  it('QA failure scenario: Vietnamese 404 correctly redirects to /vi rather than English root', () => {
    const viHtml = readFileSync(viDistPath, 'utf-8');

    const homeLinkMatch = viHtml.match(/<a\s+[^>]*href="([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*?Quay về trang chủ/);
    assert.ok(homeLinkMatch, 'Return home link must be present in Vietnamese 404');

    const href = homeLinkMatch[1];
    assert.equal(href, '/vi', 'Return home link on Vietnamese 404 must point to /vi');
    assert.notEqual(href, '/', 'Return home link on Vietnamese 404 must NOT point to English root');
  });
});
