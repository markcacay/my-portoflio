import { describe, it, expect } from 'vitest';
import { buildParticles, scrollRotation, MAX_TURN } from '../../src/scripts/particles';

// RGBA image helper: rows of [r,g,b,a] pixels.
const img = (rows: number[][][]) => ({
  width: rows[0].length, height: rows.length,
  data: new Uint8ClampedArray(rows.flat(2)),
});
const T = [0, 0, 0, 0], W = [255, 255, 255, 255], K = [10, 10, 10, 255];

describe('buildParticles', () => {
  it('makes one particle per opaque pixel and skips transparent ones', () => {
    const p = buildParticles(img([[T, W, T], [T, K, T]]), 1);
    expect(p.count).toBe(2);
    expect(p.positions.length).toBe(6);
    expect(p.colors.length).toBe(6);
  });
  it('samples every nth pixel with a stride', () => {
    const row = [W, W, W, W];
    expect(buildParticles(img([row, row, row, row]), 2).count).toBe(4);
  });
  it('colours bright pixels near white and dark pixels blue', () => {
    const p = buildParticles(img([[W, K]]), 1);
    const [r1, g1, b1, r2, g2, b2] = p.colors;
    expect(Math.min(r1, g1, b1)).toBeGreaterThan(0.85);
    expect(b2).toBeGreaterThan(r2 + 0.2);
  });
  it('gives the middle of a row more depth than its edges (rounded body)', () => {
    const p = buildParticles(img([[W, W, W, W, W]]), 1);
    const z = (i: number) => p.positions[i * 3 + 2];
    expect(z(2)).toBeGreaterThan(z(0));
    expect(z(2)).toBeGreaterThan(z(4));
  });
  it('centres the figure and normalises it to height 1', () => {
    const p = buildParticles(img([[W, T], [T, W]]), 1);
    const ys = [p.positions[1], p.positions[4]];
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThanOrEqual(1);
    expect(Math.abs(ys[0] + ys[1])).toBeLessThan(0.6);
  });
});

describe('scrollRotation', () => {
  it('starts at 0 and reaches MAX_TURN when the hero has scrolled away', () => {
    expect(scrollRotation(0)).toBe(0);
    expect(scrollRotation(1)).toBeCloseTo(MAX_TURN);
  });
  it('clamps progress outside 0..1', () => {
    expect(scrollRotation(-2)).toBe(0);
    expect(scrollRotation(5)).toBeCloseTo(MAX_TURN);
  });
});
