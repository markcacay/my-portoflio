import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { htmlFiles, readPage } from './helpers';

const slugs = readdirSync('src/content/work').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
const fm = (slug: string) => matter(readFileSync(`src/content/work/${slug}.md`, 'utf8')).data;

describe('case studies', () => {
  it('has the six agreed case studies', () => {
    expect(slugs.sort()).toEqual(['getfish', 'lorenta-nuts', 'my-medical-affairs', 'pageant-poll', 'saffron-and-more', 'virtual-assistant-talent']);
  });
  it.each(slugs)('%s builds with CreativeWork and BreadcrumbList JSON-LD', (s) => {
    const html = readPage(`work/${s}/index.html`);
    expect(html).toContain('"@type":"CreativeWork"');
    expect(html).toContain('"@type":"BreadcrumbList"');
  });
  it.each(slugs)('%s has no empty headings or undefined text', (s) => {
    const html = readPage(`work/${s}/index.html`);
    expect(html).not.toMatch(/>\s*undefined\s*</);
    expect(html).not.toMatch(/<h[1-4][^>]*>\s*<\/h[1-4]>/);
  });
  it.each(slugs)('%s shows the numbers section only when it has metrics, the live link only when it has a url', (s) => {
    const html = readPage(`work/${s}/index.html`);
    const data = fm(s);
    expect(html.includes('Results in numbers')).toBe(Array.isArray(data.metrics) && data.metrics.length > 0);
    expect(html.includes('class="live-link"')).toBe(Boolean(data.url));
  });
  it('the work index links every case study', () => {
    const html = readPage('work/index.html');
    for (const s of slugs) expect(html).toContain(`href="/work/${s}/"`);
  });
});

describe('testimonials and privacy', () => {
  it('hides the testimonials section while there are fewer than 2', async () => {
    const { testimonials } = await import('../../src/data/testimonials');
    if (testimonials.length < 2) for (const p of ['index.html', 'about/index.html']) {
      try { expect(readPage(p)).not.toContain('class="testimonials'); } catch (e: any) { if (e.code !== 'ENOENT') throw e; }
    }
  });
  it.each(htmlFiles())('%s shows no phone numbers and no email except Mark\'s', (p) => {
    const text = readPage(p).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
    expect(text).not.toMatch(/\b\d{3}[-. ]\d{3}[-. ]\d{4}\b/);
    for (const e of text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi) ?? []) expect(e).toBe('markcacay@gmail.com');
  });
  it('the about page lists the full timeline back to 2010', () => {
    const html = readPage('about/index.html');
    for (const co of ['Silver Connect', 'Dalang', 'Virtual Assistant Talent', 'xDigital Excellence', 'Virtual Work Done', 'Dryden Labs']) expect(html).toContain(co);
  });
  // Page count pins the reviewed CV (2026, no references page; text scanned for phones/emails before swapping in).
  it('the public CV is the reviewed 4-page version', () => {
    const pdf = readFileSync('public/mark-cacay-cv.pdf', 'latin1');
    expect(pdf.match(/\/Type\s*\/Page[^s]/g)?.length).toBe(4);
  });
});
