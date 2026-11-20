import { describe, it, expect } from 'vitest';
import { personJsonLd, breadcrumbJsonLd } from '../../src/lib/seo';

describe('personJsonLd', () => {
  const p = personJsonLd() as Record<string, unknown>;
  it('describes Mark as a Person at the site URL', () => {
    expect(p['@type']).toBe('Person');
    expect(p.url).toBe('https://markcacay.pages.dev');
    expect(p.sameAs).toContain('https://www.linkedin.com/in/mark-cacay-858a1896/');
  });
  it('never includes a phone number or references contact details', () => {
    const s = JSON.stringify(p);
    expect(p).not.toHaveProperty('telephone');
    for (const bad of ['000-000-0000', '000-000-0000', 'redacted@', 'redacted', 'redacted@']) expect(s).not.toContain(bad);
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
