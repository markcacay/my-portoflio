import { describe, it, expect } from 'vitest';
import { personJsonLd, breadcrumbJsonLd } from '../../src/lib/seo';

describe('personJsonLd', () => {
  const p = personJsonLd() as Record<string, unknown>;
  it('describes Mark as a Person at the site URL', () => {
    expect(p['@type']).toBe('Person');
    expect(p.url).toBe('https://markcacay.pages.dev');
    expect(p.sameAs).toContain('https://www.linkedin.com/in/mark-cacay-858a1896/');
  });
  it('never includes a phone number or any email except Mark\'s', () => {
    const s = JSON.stringify(p);
    expect(p).not.toHaveProperty('telephone');
    expect(s).not.toMatch(/\d{3}[-. ]\d{3}[-. ]\d{4}/);
    for (const e of s.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) ?? []) expect(e).toBe('markcacay@gmail.com');
  });
});

describe('breadcrumbJsonLd', () => {
  it('turns paths into absolute URLs in order', () => {
    const b = breadcrumbJsonLd([{ name: 'Work', path: '/work/' }, { name: 'Getfish', path: '/work/getfish/' }]) as any;
    expect(b['@type']).toBe('BreadcrumbList');
    expect(b.itemListElement[0]).toMatchObject({ position: 1, name: 'Work', item: 'https://markcacay.pages.dev/work/' });
    expect(b.itemListElement[1].position).toBe(2);
  });
});
