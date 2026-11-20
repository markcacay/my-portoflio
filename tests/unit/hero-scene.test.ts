import { describe, it, expect } from 'vitest';
import { shouldRun3D, particleStride } from '../../src/scripts/hero-scene';

describe('shouldRun3D', () => {
  const ok = { reducedMotion: false, webgl: true, saveData: false, finePointer: true };
  it('runs when motion is allowed, WebGL works and data saver is off', () => expect(shouldRun3D(ok)).toBe(true));
  it('also runs on touch devices', () => expect(shouldRun3D({ ...ok, finePointer: false })).toBe(true));
  it('skips for reduced motion', () => expect(shouldRun3D({ ...ok, reducedMotion: true })).toBe(false));
  it('skips without WebGL', () => expect(shouldRun3D({ ...ok, webgl: false })).toBe(false));
  it('skips with data saver on', () => expect(shouldRun3D({ ...ok, saveData: true })).toBe(false));
});

describe('particleStride', () => {
  it('uses every pixel with a mouse and every 2nd on touch devices', () => {
    expect(particleStride(true)).toBe(1);
    expect(particleStride(false)).toBe(2);
  });
});
