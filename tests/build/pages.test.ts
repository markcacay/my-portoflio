import { describe, it, expect } from 'vitest';
import { htmlFiles, readPage, titleOf } from './helpers';

const pages = htmlFiles();

describe('every built page', () => {
  it('builds at least the 404 page', () => expect(pages).toContain('404.html'));
  it.each(pages)('%s has one title, a description and a canonical on the site URL', (p) => {
    const html = readPage(p);
    expect(titleOf(html)).toHaveLength(1);
    expect(html).toMatch(/<meta name="description" content="[^"]{20,}"/);
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/markcacay\.pages\.dev\//);
  });
  it.each(pages)('%s links to /contact and the CV', (p) => {
    const html = readPage(p);
    expect(html).toContain('href="/contact/"');
    expect(html).toContain('href="/mark-cacay-cv.pdf"');
  });
  it.each(pages)('%s has Person JSON-LD', (p) => expect(readPage(p)).toMatch(/"@type":"Person"/));
  it('page titles are unique', () => {
    const titles = pages.map((p) => titleOf(readPage(p))[0]);
    expect(new Set(titles).size).toBe(titles.length);
  });
  it('404 is noindex', () => expect(readPage('404.html')).toContain('<meta name="robots" content="noindex"'));
});
