import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DOCS_PATH = path.resolve(__dirname, '../../docs/domain-setup-guide.md');
const README_PATH = path.resolve(__dirname, '../../README.md');

/**
 * Domain guide validation helper that enforces budget recommendations
 * and rejects any promotional/predatory TLD recommendations.
 */
export function validateDomainGuideRecommendations(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Rule 1: Guide must cite VNNIC regulations
  if (!content.includes('48/2025/TT-BKHCN') && !content.includes('20/2023/TT-BTC')) {
    errors.push('Missing official VNNIC fee circular citation (48/2025/TT-BKHCN or 20/2023/TT-BTC)');
  }
  if (!content.includes('826/QĐ-BTTTT')) {
    errors.push('Missing official Decision 826/QĐ-BTTTT citation for digital youth program');
  }

  // Rule 2: Must explicitly cover .id.vn and .name.vn
  if (!content.includes('.id.vn') || !content.includes('.name.vn')) {
    errors.push('Guide must cover both .id.vn and .name.vn domains');
  }

  // Rule 3: Must include DNS configuration records for Cloudflare
  if (!content.includes('CNAME') || !content.includes('.pages.dev')) {
    errors.push('Guide must include CNAME DNS records pointing to Cloudflare Pages (*.pages.dev)');
  }

  // Rule 4: Anti-promotional TLD guard - promotional TLDs (.xyz, .site, .online, .top)
  // must NEVER be recommended as budget alternatives; they must only appear in warning contexts.
  const predatoryTlds = ['.xyz', '.site', '.online', '.top'];
  for (const tld of predatoryTlds) {
    // If the guide contains a positive recommendation like "Khuyên dùng .xyz" or "Recommend .xyz"
    const positivePattern = new RegExp(`(khuyến nghị|nên dùng|recommend|lựa chọn tốt|tiết kiệm).*?${tld.replace('.', '\\.')}`, 'i');
    if (positivePattern.test(content)) {
      errors.push(`Guide improperly recommends predatory TLD ${tld} instead of warning against renewal traps`);
    }
  }

  // Rule 5: Fallback URL strategy must be documented
  if (!content.includes('pages.dev') && !content.includes('github.io')) {
    errors.push('Guide must document a 0 VND fallback URL strategy (e.g. pages.dev or github.io)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe('Domain Registration & Cloudflare DNS Guide (docs/domain-setup-guide.md)', () => {
  it('verifies docs/domain-setup-guide.md exists and is substantive (> 2KB)', () => {
    assert.ok(fs.existsSync(DOCS_PATH), `Expected ${DOCS_PATH} to exist`);
    const stats = fs.statSync(DOCS_PATH);
    assert.ok(stats.size > 2048, `Expected guide size > 2KB, got ${stats.size} bytes`);
  });

  it('contains official VNNIC legal and fee regulations', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('48/2025/TT-BKHCN'), 'Cites Circular 48/2025/TT-BKHCN');
    assert.ok(content.includes('826/QĐ-BTTTT'), 'Cites Decision 826/QĐ-BTTTT');
    assert.match(content, /18[–\-]23/, 'Specifies 18–23 age exemption eligibility');
    assert.match(content, /0 VNĐ/, 'Specifies 0 VND fee exemption for youth');
  });

  it('contains comprehensive pricing comparison table under 100,000 VND', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('.id.vn'), 'Covers .id.vn');
    assert.ok(content.includes('.name.vn'), 'Covers .name.vn');
    assert.match(content, /50\.000/, 'Lists 50.000 VND maintenance fee');
    assert.match(content, /20\.000/, 'Lists 20.000 VND maintenance fee for .name.vn');
    assert.match(content, /60\.000/, 'Lists standard 60.000 VND total for .id.vn');
    assert.match(content, /30\.000/, 'Lists standard 30.000 VND total for .name.vn');
  });

  it('contains renewal trap warnings against predatory promotional TLDs', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('.xyz'), 'Warns about .xyz');
    assert.ok(content.includes('.site'), 'Warns about .site');
    assert.ok(content.includes('.online'), 'Warns about .online');
    assert.match(content, /350\.000|450\.000|500\.000/, 'Warns about inflated renewal fees from year 2');
    assert.ok(content.includes('Whois'), 'Highlights Whois privacy fee considerations');
  });

  it('recommends accredited VNNIC registrars and eKYC requirements', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('TND') || content.includes('tnd.vn'), 'Mentions TND');
    assert.ok(content.includes('iNET') || content.includes('inet.vn'), 'Mentions iNET');
    assert.ok(content.includes('PA Việt Nam') || content.includes('pavietnam'), 'Mentions PA Vietnam');
    assert.ok(content.includes('Mắt Bão') || content.includes('matbao'), 'Mentions Mat Bao');
    assert.ok(content.includes('CCCD'), 'Details CCCD requirement');
    assert.ok(content.includes('eKYC'), 'Details eKYC authentication flow');
  });

  it('specifies Cloudflare DNS records and SSL/TLS configuration', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('CNAME'), 'Specifies CNAME DNS records');
    assert.ok(content.includes('.pages.dev'), 'Points CNAME to Cloudflare Pages');
    assert.ok(content.includes('Full (strict)'), 'Recommends Full (strict) SSL encryption mode');
    assert.ok(content.includes('Always Use HTTPS'), 'Enforces Always Use HTTPS directive');
    assert.ok(content.includes('CNAME Flattening'), 'Explains Cloudflare CNAME flattening for root domain');
  });

  it('documents 0 VND fallback URL strategy (longdd.pages.dev / github.io)', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    assert.ok(content.includes('pages.dev'), 'Documents pages.dev fallback');
    assert.ok(content.includes('longdd.pages.dev'), 'Mentions longdd.pages.dev candidate fallback');
    assert.ok(content.includes('lombeo.github.io'), 'Mentions lombeo.github.io GitHub Pages fallback');
  });

  it('validates guide passes recommendation audit with zero errors', () => {
    const content = fs.readFileSync(DOCS_PATH, 'utf-8');
    const result = validateDomainGuideRecommendations(content);
    assert.equal(result.valid, true, `Validation failed: ${result.errors.join(', ')}`);
    assert.equal(result.errors.length, 0);
  });

  it('QA Failure Scenario: linter rejects any guide recommending promotional TLD as budget choice', () => {
    const badContent = `
      # Hướng dẫn mua domain giá rẻ
      Chúng tôi khuyến nghị mua tên miền .xyz vì nó rẻ nhất chỉ 20k năm đầu.
      Thông tư 48/2025/TT-BKHCN và Quyết định 826/QĐ-BTTTT.
      Tên miền .id.vn và .name.vn.
      CNAME trỏ về portfolio.pages.dev.
    `;
    const result = validateDomainGuideRecommendations(badContent);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('improperly recommends predatory TLD .xyz')));
  });

  it('README.md provides link to docs/domain-setup-guide.md', () => {
    const readme = fs.readFileSync(README_PATH, 'utf-8');
    assert.ok(readme.includes('docs/domain-setup-guide.md'), 'README.md links to domain setup guide');
    assert.ok(readme.includes('.id.vn'), 'README mentions .id.vn');
    assert.ok(readme.includes('.name.vn'), 'README mentions .name.vn');
  });
});
