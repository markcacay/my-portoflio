import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, htmlFiles, readPage } from './helpers';

const M_PATH = 'M12 52V28a10 10 0 0 1 20 0v24M32 28a10 10 0 0 1 20 0v10';

describe.each(htmlFiles())('%s', (p) => {
  const html = readPage(p);
  it('header has the Wired m logo linking home with an accessible name', () => {
    const header = html.match(/<header[\s\S]*?<\/header>/)![0];
    expect(header).toMatch(/<a[^>]+href="\/"[^>]*aria-label="Mark Cacay, home"/);
    expect(header).toContain(M_PATH);
  });
  it('footer shows the logo', () => {
    const footer = html.match(/<footer[\s\S]*?<\/footer>/)![0];
    expect(footer).toContain(M_PATH);
  });
  it('links an Apple touch icon', () => expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png"'));
});

describe('icon files', () => {
  it('favicon.svg is the Wired m', () => expect(readFileSync(join(DIST, 'favicon.svg'), 'utf8')).toContain(M_PATH));
  it('apple-touch-icon.png exists', () => expect(existsSync(join(DIST, 'apple-touch-icon.png'))).toBe(true));
});
