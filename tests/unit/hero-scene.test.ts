import { describe, it, expect } from 'vitest';
import { shouldRun3D } from '../../src/scripts/hero-scene';

describe('shouldRun3D', () => {
  const ok = { reducedMotion: false, webgl: true, saveData: false, finePointer: true };
  it('runs when motion is allowed, WebGL works and data saver is off', () => expect(shouldRun3D(ok)).toBe(true));
  it('skips for reduced motion', () => expect(shouldRun3D({ ...ok, reducedMotion: true })).toBe(false));
  it('skips without WebGL', () => expect(shouldRun3D({ ...ok, webgl: false })).toBe(false));
  it('skips on touch-only devices (they keep the poster)', () => expect(shouldRun3D({ ...ok, finePointer: false })).toBe(false));
  it('skips with data saver on', () => expect(shouldRun3D({ ...ok, saveData: true })).toBe(false));
});
