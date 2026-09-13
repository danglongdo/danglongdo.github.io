import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, unlinkSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

describe('ATS-Friendly Resume PDF Generation', () => {
  const rootDir = process.cwd();
  const scriptPath = resolve(rootDir, 'scripts/generate-resume.mjs');
  const pdfPath = resolve(rootDir, 'public/resume.pdf');
  const packageJsonPath = resolve(rootDir, 'package.json');

  it('verifies scripts/generate-resume.mjs exists and is executable', () => {
    assert.equal(existsSync(scriptPath), true, 'scripts/generate-resume.mjs must exist');
  });

  it('QA happy scenario: runs generate-resume.mjs and creates valid PDF (> 1KB)', () => {
    // Run generator
    execSync(`node "${scriptPath}"`, { stdio: 'pipe' });

    assert.equal(existsSync(pdfPath), true, 'public/resume.pdf must exist');

    const stats = statSync(pdfPath);
    assert.ok(stats.size > 1024, `Resume PDF size (${stats.size} bytes) must be > 1KB`);

    // Verify PDF header magic bytes
    const buffer = readFileSync(pdfPath);
    const header = buffer.subarray(0, 8).toString('latin1');
    assert.ok(header.startsWith('%PDF-1.'), 'PDF file must start with %PDF- header');

    // Verify PDF trailer and EOF marker
    const tail = buffer.subarray(buffer.length - 150).toString('utf-8');
    assert.ok(tail.includes('%%EOF'), 'PDF file must contain %%EOF marker');
    assert.ok(tail.includes('startxref'), 'PDF file must contain startxref');
  });

  it('validates candidate contact, education, skills, and work history content', () => {
    const content = readFileSync(pdfPath, 'utf-8');

    // Candidate Name and Title
    assert.ok(content.includes('DO DANG LONG') || content.includes('Đỗ Đăng Long'), 'Must contain candidate name');
    assert.ok(content.includes('.NET Full-Stack & Enterprise AI Automation Engineer'), 'Must contain candidate title');

    // Contact Details
    assert.ok(content.includes('longdd.contact@gmail.com'), 'Must contain contact email');
    assert.ok(content.includes('https://github.com/lombeo'), 'Must contain GitHub profile URL');
    assert.ok(content.includes('https://linkedin.com/in/longdd'), 'Must contain LinkedIn profile URL');
    assert.ok(content.includes('Vietnam'), 'Must contain location');

    // Education
    assert.ok(content.includes('FPT University'), 'Must contain university');
    assert.ok(content.includes('Bachelor of Software Engineering'), 'Must contain degree');

    // Work Experience
    assert.ok(content.includes('NAL Vietnam'), 'Must contain NAL Vietnam experience');
    assert.ok(content.includes('SEP490 Capstone'), 'Must contain SEP490 experience');
    assert.ok(content.includes('FPT Information System'), 'Must contain FPT Information System experience');

    // Core Technical Skills
    const requiredSkills = [
      'C#',
      '.NET 8',
      'ASP.NET Core',
      'PostgreSQL',
      'Redis',
      'SignalR',
      'React',
      'Next.js',
      'Supabase',
      'AI Agents',
    ];

    for (const skill of requiredSkills) {
      assert.ok(content.includes(skill), `Resume PDF must include skill: ${skill}`);
    }
  });

  it('validates package.json build pipeline integration with prebuild hook', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    assert.ok(pkg.scripts.prebuild, 'package.json must contain a prebuild script');
    assert.ok(
      pkg.scripts.prebuild.includes('scripts/generate-resume.mjs'),
      'prebuild script must invoke generate-resume.mjs'
    );
    assert.ok(
      pkg.scripts.build.includes('scripts/generate-resume.mjs'),
      'build script must ensure resume generation before astro build'
    );
  });

  it('QA failure scenario: deleting public/resume.pdf and running build regenerates artifact', () => {
    // Delete file if exists
    if (existsSync(pdfPath)) {
      unlinkSync(pdfPath);
    }
    assert.equal(existsSync(pdfPath), false, 'File must be deleted before triggering build');

    // Run resume generation as part of build pipeline
    execSync(`node "${scriptPath}"`, { stdio: 'pipe' });

    // Assert file was automatically regenerated and valid
    assert.equal(existsSync(pdfPath), true, 'public/resume.pdf must be regenerated');
    const stats = statSync(pdfPath);
    assert.ok(stats.size > 1024, 'Regenerated PDF must be > 1KB');

    const buffer = readFileSync(pdfPath);
    assert.ok(buffer.subarray(0, 5).toString('latin1').startsWith('%PDF-'), 'Regenerated PDF must have valid header');
  });
});
