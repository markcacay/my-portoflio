import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';
import { makeWorkSchema } from '../../src/lib/work-schema';

// Stand-in for Astro's image() helper: accepts any string path.
const schema = makeWorkSchema(() => z.string());
const minimal = {
  title: 'T', client: 'C', summary: 'S', role: 'R', stack: ['WordPress'],
  problem: 'P', approach: 'A', result: 'Res', cover: './cover.png',
  featured: false, order: 1, kind: 'wordpress',
};

describe('work schema', () => {
  it('accepts an entry without metrics, url or gallery', () => {
    expect(schema.safeParse(minimal).success).toBe(true);
  });
  it('rejects an entry missing problem', () => {
    const { problem, ...rest } = minimal;
    expect(schema.safeParse(rest).success).toBe(false);
  });
  it('rejects an unknown kind', () => {
    expect(schema.safeParse({ ...minimal, kind: 'other' }).success).toBe(false);
  });
  it('rejects a url that is not a URL', () => {
    expect(schema.safeParse({ ...minimal, url: 'getfish' }).success).toBe(false);
  });
});
