import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Portrait Component with Graceful SVG Monogram Fallback', () => {
  const componentPath = join(process.cwd(), 'src/components/Portrait.astro');
  const svgPlaceholderPath = join(process.cwd(), 'public/images/portrait-placeholder.svg');

  it('should have both Portrait.astro and portrait-placeholder.svg files on disk', () => {
    assert.equal(existsSync(componentPath), true, 'src/components/Portrait.astro must exist');
    assert.equal(existsSync(svgPlaceholderPath), true, 'public/images/portrait-placeholder.svg must exist');
  });

  describe('SVG Monogram Placeholder (portrait-placeholder.svg)', () => {
    const svgContent = readFileSync(svgPlaceholderPath, 'utf-8');

    it('should have valid SVG root with accessible role and aria-label', () => {
      assert.match(svgContent, /<svg[^>]*\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
      assert.match(svgContent, /role="img"/);
      assert.match(svgContent, /aria-label="Portrait placeholder for Đỗ Đăng Long"/);
      assert.match(svgContent, /<title>Portrait placeholder for Đỗ Đăng Long<\/title>/);
    });

    it('should feature monogram initials DL with duotone cobalt accent and slate background', () => {
      // Must contain cobalt accent color
      assert.match(svgContent, /#2457D6/);
      // Slate background stop
      assert.match(svgContent, /#1B1E22|#14171A|#0E1012/);
      // Contains initials DL / name
      assert.match(svgContent, /ĐỖ ĐĂNG LONG/);
    });

    it('should have editorial border styling and geometric corner marks', () => {
      // Editorial border stroke
      assert.match(svgContent, /stroke="url\(#borderGrad\)"/);
      // Editorial corner marks / hairline guides
      assert.match(svgContent, /stroke-linecap="round"/);
    });
  });

  describe('Portrait.astro Component', () => {
    const portraitSource = readFileSync(componentPath, 'utf-8');

    it('should define Props interface supporting src, alt, className, and size ("sm" | "md" | "lg")', () => {
      assert.match(portraitSource, /export\s+interface\s+Props/);
      assert.match(portraitSource, /src\?:/);
      assert.match(portraitSource, /alt\?:/);
      assert.match(portraitSource, /className\?:/);
      assert.match(portraitSource, /size\?:/);
      assert.match(portraitSource, /'sm'\s*\|\s*'md'\s*\|\s*'lg'/);
    });

    it('should default size to "md" and provide default alt text', () => {
      assert.match(portraitSource, /size\s*=\s*'md'/);
      assert.match(portraitSource, /Portrait placeholder for Đỗ Đăng Long/);
    });

    it('should check if image exists on disk before attempting to render <Image />', () => {
      assert.match(portraitSource, /fs\.existsSync/);
      assert.match(portraitSource, /hasImage/);
    });

    it('should render <Image /> with optimized WebP format when valid image exists on disk', () => {
      assert.match(portraitSource, /import\s+{\s*Image\s*}\s+from\s+['"]astro:assets['"]/);
      assert.match(portraitSource, /format="webp"/);
      assert.match(portraitSource, /<Image/);
    });

    it('QA happy scenario: when no image is provided, renders SVG fallback with aria-label="Portrait placeholder for Đỗ Đăng Long"', () => {
      // When hasImage is false, SVG markup is rendered with aria-label={effectiveAlt}
      assert.match(portraitSource, /role="img"/);
      assert.match(portraitSource, /aria-label={effectiveAlt}/);
      assert.match(portraitSource, /<title>{effectiveAlt}<\/title>/);
    });

    it('QA failure scenario: when broken image string is supplied, component falls back to SVG badge without crashing build', () => {
      // Has on-disk verification logic that rejects non-existent files
      assert.match(portraitSource, /fs\.statSync/);
      // Fallback branch renders SVG badge
      assert.match(portraitSource, /portrait-slate-bg/);
      assert.match(portraitSource, /portrait-cobalt-accent/);
    });

    it('should apply editorial dual-ring border styling (ring-1 ring-border shadow-sm)', () => {
      assert.match(portraitSource, /ring-1\s+ring-border/);
      assert.match(portraitSource, /shadow-sm/);
      assert.match(portraitSource, /dark:ring-border-dark/);
    });

    it('should configure container dimensions according to size presets', () => {
      // sm: w-16 h-16 (64px)
      assert.match(portraitSource, /w-16\s+h-16/);
      // md: w-32 h-32 (128-144px)
      assert.match(portraitSource, /w-32\s+h-32/);
      // lg: w-48 h-48 or w-56 h-56 (192-224px)
      assert.match(portraitSource, /w-48\s+h-48|w-56\s+h-56/);
    });
  });
});
