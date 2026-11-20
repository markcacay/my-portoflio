import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, htmlFiles, readPage } from './helpers';

const home = readPage('index.html');
const js = readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.js'));
const jsText = (f: string) => readFileSync(join(DIST, '_astro', f), 'utf8');
const scriptSrcs = (html: string) => [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);

describe('homepage', () => {
  it('has the value proposition as the only h1', () => {
    expect(home.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(home).toMatch(/<h1[^>]*>I build fast WordPress sites and connect them to the tools your business runs on\.<\/h1>/);
  });
  it('hero has a high-priority poster image and both CTAs in plain HTML', () => {
    const hero = home.slice(home.indexOf('id="hero"'), home.indexOf('id="selected-work"'));
    expect(hero).toMatch(/<img[^>]+fetchpriority="high"/);
    expect(hero).toContain('href="/contact/"');
    expect(hero).toContain('href="/mark-cacay-cv.pdf"');
  });
  it('lists exactly the 3 featured case studies in order', () => {
    const work = home.slice(home.indexOf('id="selected-work"'), home.indexOf('id="services"'));
    const links = [...work.matchAll(/class="case-card[^"]*" href="\/work\/([^/]+)\/"/g)].map((m) => m[1]);
    expect(links).toEqual(['pageant-poll', 'virtual-assistant-talent', 'my-medical-affairs']);
  });
  it('the hero script loads only on the homepage', () => {
    const heroSrc = scriptSrcs(home).filter((s) => jsText(s.split('/').pop()!).includes('webgl'));
    expect(heroSrc.length).toBe(1);
    for (const p of htmlFiles().filter((p) => p !== 'index.html')) expect(readPage(p)).not.toContain(heroSrc[0]);
  });
  it('Three.js is never referenced directly by any page (loaded on demand only)', () => {
    const threeChunks = js.filter((f) => jsText(f).includes('WebGLRenderer'));
    expect(threeChunks.length).toBeGreaterThan(0);
    for (const p of htmlFiles()) for (const c of threeChunks) expect(readPage(p)).not.toContain(c);
  });
});
