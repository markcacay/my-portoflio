import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, htmlFiles, readPage } from './helpers';

describe('crawl files', () => {
  it('robots.txt allows crawling and points to the sitemap', () => {
    const robots = readPage('robots.txt');
    expect(robots).toMatch(/User-agent: \*/);
    expect(robots).not.toMatch(/Disallow: \/\s*$/m);
    expect(robots).toContain('Sitemap: https://markcacay.pages.dev/sitemap-index.xml');
  });
  it('sitemap lists every public page and not the 404', () => {
    const sm = readPage('sitemap-0.xml');
    const base = 'https://markcacay.pages.dev';
    for (const p of ['/', '/work/', '/about/', '/contact/', '/work/pageant-poll/', '/work/virtual-assistant-talent/', '/work/my-medical-affairs/', '/work/getfish/', '/work/lorenta-nuts/', '/work/saffron-and-more/'])
      expect(sm).toContain(`<loc>${base}${p}</loc>`);
    expect(sm).not.toContain('404');
  });
  it('the favicon exists', () => expect(existsSync(join(DIST, 'favicon.svg'))).toBe(true));
});

describe.each(htmlFiles())('%s', (p) => {
  const html = readPage(p);
  it('its og:image file exists and is 1200 wide', () => {
    const url = html.match(/<meta property="og:image" content="([^"]+)"/)![1];
    expect(existsSync(join(DIST, new URL(url).pathname))).toBe(true);
    expect(html).toContain('<meta property="og:image:width" content="1200"');
  });
  it('every image has alt text', () => {
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) expect(img).toMatch(/alt="[^"]+"/);
  });
});

describe('Search Console', () => {
  it('serves the Google verification file unchanged', () => {
    expect(readPage('googleb48524b881d7305e.html').trim()).toBe('google-site-verification: googleb48524b881d7305e.html');
  });
});
