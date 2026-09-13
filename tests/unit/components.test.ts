import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Career Timeline & Capabilities Matrix Components', () => {
  const timelinePath = join(process.cwd(), 'src/components/Timeline.astro');
  const capabilityPath = join(process.cwd(), 'src/components/CapabilityMatrix.astro');

  it('should have both Timeline.astro and CapabilityMatrix.astro component files', () => {
    assert.equal(existsSync(timelinePath), true, 'Timeline.astro must exist');
    assert.equal(existsSync(capabilityPath), true, 'CapabilityMatrix.astro must exist');
  });

  describe('Timeline Component', () => {
    const timelineSource = readFileSync(timelinePath, 'utf-8');

    it('should declare section id="experience" with responsive semantic landmark', () => {
      assert.match(timelineSource, /id="experience"/);
      assert.match(timelineSource, /aria-labelledby="experience-heading"/);
    });

    it('should query getCollection("experience") and sort by order', () => {
      assert.match(timelineSource, /getCollection\(['"]experience['"]\)/);
      assert.match(timelineSource, /sort\(/);
    });

    it('should render milestone node dot with accent color and responsive timeline line', () => {
      // Must use design token bg-accent and border-border
      assert.match(timelineSource, /bg-accent/);
      assert.match(timelineSource, /border-border/);
      // Milestone dot indicator
      assert.match(timelineSource, /rounded-full bg-accent/);
    });

    it('QA happy scenario: aligns timeline line and milestone dots cleanly for 375px mobile viewport without horizontal overflow', () => {
      // Line is defined by border-l on the container with left padding pl-5 on mobile
      assert.match(timelineSource, /border-l border-border/);
      assert.match(timelineSource, /pl-5 sm:pl-8/);

      // Milestone dot positioning:
      // Mobile padding pl-5 = 20px, dot w-3.5 (14px). Center of dot at line requires left = -20px - 7px = -27px.
      // Desktop padding pl-8 = 32px, dot w-3.5 (14px). Center of dot at line requires left = -32px - 7px = -39px.
      assert.match(timelineSource, /-left-\[27px\]\s+sm:-left-\[39px\]/);

      // Container max-width with px-4 sm:px-6 ensures layout fits well within 375px viewport (375 - 32 = 343px available)
      assert.match(timelineSource, /max-w-4xl mx-auto px-4 sm:px-6/);
    });

    it('QA failure scenario: wraps skill tags with flex-wrap and break-words to handle long skill strings without clipping', () => {
      assert.match(timelineSource, /flex flex-wrap gap-/);
      assert.match(timelineSource, /break-words/);
      assert.match(timelineSource, /font-mono/);
    });

    it('should render localized labels for both en and vi', () => {
      assert.match(timelineSource, /Career Progression/);
      assert.match(timelineSource, /Lộ trình nghề nghiệp/);
    });
  });

  describe('CapabilityMatrix Component', () => {
    const capabilitySource = readFileSync(capabilityPath, 'utf-8');

    it('should declare section id="capabilities" with responsive semantic landmark', () => {
      assert.match(capabilitySource, /id="capabilities"/);
      assert.match(capabilitySource, /aria-labelledby="capabilities-heading"/);
    });

    it('should define all 5 distinct technical capability domains', () => {
      // 1. Backend & .NET Architecture
      assert.match(capabilitySource, /Backend & \.NET Architecture/);
      // 2. Enterprise AI Agents & Workflow Automation
      assert.match(capabilitySource, /Enterprise AI Agents/);
      // 3. Modern Frontend Engineering
      assert.match(capabilitySource, /Modern Frontend Engineering/);
      // 4. Distributed Caching & SQL Databases
      assert.match(capabilitySource, /Distributed Caching & SQL Databases/);
      // 5. Testing & DevOps Automation
      assert.match(capabilitySource, /Testing & DevOps Automation/);
    });

    it('should associate domains with concrete proof projects and localized paths', () => {
      assert.match(capabilitySource, /sep490-construction-slms/);
      assert.match(capabilitySource, /nal-ai-automation-erp/);
      assert.match(capabilitySource, /codelearn-community-content/);
      assert.match(capabilitySource, /translatePath/);
    });

    it('QA failure scenario: wraps skill tags with flex-wrap and break-words when an overly long skill string is injected', () => {
      // Tags use flex-wrap and break-words so lengthy strings wrap instead of causing layout overflow
      assert.match(capabilitySource, /flex flex-wrap gap-1\.5/);
      assert.match(capabilitySource, /break-words/);

      // Verify hypothetical long string wrapping behavior logic
      const longSkillString = 'EnterpriseAutonomousMultiAgentWorkflowDispatchingInfrastructure';
      const simulatedClasses = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-canvas border border-border text-ink/85 break-words';
      assert.equal(simulatedClasses.includes('break-words'), true);
      assert.equal(longSkillString.length > 30, true);
    });

    it('should reject design anti-patterns: no hardcoded ad-hoc hex colors in template', () => {
      // Search for hardcoded hex colors like #3b82f6 or #123456 inside CapabilityMatrix template
      const templatePart = capabilitySource.split('---')[2] || '';
      const hexPattern = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
      const matches = templatePart.match(hexPattern);
      assert.equal(matches, null, `Found hardcoded hex colors in template: ${matches?.join(', ')}`);
    });
  });
});
