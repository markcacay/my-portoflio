export interface Env { reducedMotion: boolean; webgl: boolean; saveData: boolean }

export const shouldRun3D = (env: Env): boolean => !env.reducedMotion && env.webgl && !env.saveData;

export function detectEnv(): Env {
  let webgl = false;
  try { webgl = !!document.createElement('canvas').getContext('webgl2'); } catch { /* no WebGL */ }
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, webgl, saveData: !!conn?.saveData };
}

// Loads Three.js only when the scene will actually run; returns a dispose function.
export async function mountHero(parent: HTMLElement): Promise<() => void> {
  const { createScene } = await import('./hero-three');
  return createScene(parent);
}
