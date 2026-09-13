import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Project Content Case Studies', () => {
  const enPath = join(process.cwd(), 'src/content/projects/en/nal-ai-automation-erp.md');
  const viPath = join(process.cwd(), 'src/content/projects/vi/nal-ai-automation-erp.md');

  it('should have both EN and VI case study files for nal-ai-automation-erp', () => {
    assert.equal(existsSync(enPath), true);
    assert.equal(existsSync(viPath), true);
  });

  it('should not contain unapproved internal screenshot references matching internal-*', () => {
    const enContent = readFileSync(enPath, 'utf-8');
    const viContent = readFileSync(viPath, 'utf-8');

    const internalScreenshotRegex = /internal-[a-zA-Z0-9_-]+\.(png|jpe?g|webp|svg|gif)/i;
    assert.equal(internalScreenshotRegex.test(enContent), false);
    assert.equal(internalScreenshotRegex.test(viContent), false);
  });

  it('should preserve strict enterprise confidentiality without internal credentials or private repo links', () => {
    const enContent = readFileSync(enPath, 'utf-8');
    const viContent = readFileSync(viPath, 'utf-8');

    // Reject internal network IP or private git repos
    const confidentialPattern = /192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|internal-screenshot/i;
    assert.equal(confidentialPattern.test(enContent), false);
    assert.equal(confidentialPattern.test(viContent), false);
  });

  it('should reject unapproved internal-* image references if introduced (QA failure scenario assertion)', () => {
    const dummyBadContent = 'Here is an architecture screenshot: ![System Diagram](/assets/internal-erp-architecture.png)';
    const internalScreenshotRegex = /internal-[a-zA-Z0-9_-]+\.(png|jpe?g|webp|svg|gif)/i;
    assert.equal(internalScreenshotRegex.test(dummyBadContent), true);
  });
});
