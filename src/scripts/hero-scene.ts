export interface Env { reducedMotion: boolean; webgl: boolean; saveData: boolean; finePointer: boolean }

export const shouldRun3D = (env: Env): boolean => !env.reducedMotion && env.webgl && !env.saveData;

// Touch devices get half the particles in each direction (a quarter of the points).
export const particleStride = (finePointer: boolean): number => (finePointer ? 1 : 2);

export function detectEnv(): Env {
  let webgl = false;
  try { webgl = !!document.createElement('canvas').getContext('webgl2'); } catch { /* no WebGL */ }
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    webgl,
    saveData: !!conn?.saveData,
    finePointer: matchMedia('(any-pointer: fine)').matches,
  };
}

// Loads Three.js only when the scene will actually run; returns a dispose function.
export async function mountHero(hero: HTMLElement, slot: HTMLElement, env: Env): Promise<() => void> {
  const { createPortrait } = await import('./portrait-three');
  return createPortrait(hero, slot, particleStride(env.finePointer));
}
