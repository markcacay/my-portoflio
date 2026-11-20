export interface Env { reducedMotion: boolean; webgl: boolean; saveData: boolean; finePointer: boolean }

// Touch-only devices keep the static poster: same information, no GPU or battery cost.
export const shouldRun3D = (env: Env): boolean => !env.reducedMotion && env.webgl && !env.saveData && env.finePointer;

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
export async function mountHero(parent: HTMLElement): Promise<() => void> {
  const { createScene } = await import('./hero-three');
  return createScene(parent);
}
