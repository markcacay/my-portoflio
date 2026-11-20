export interface RGBAImage { width: number; height: number; data: Uint8ClampedArray }
export interface Particles { count: number; positions: Float32Array; colors: Float32Array; edge: Float32Array }

export const MAX_TURN = 1.1; // radians of turn (~63°) by the time the hero has scrolled away

const COBALT = [0.24, 0.44, 1.0];
const WHITE = [0.95, 0.97, 1];
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Turns an image with transparency into a point cloud: centred, height 1, rounded depth per row.
export function buildParticles(img: RGBAImage, stride: number): Particles {
  const { width: w, height: h, data } = img;
  const opaque = (x: number, y: number) => data[(y * w + x) * 4 + 3] > 128;
  const pos: number[] = [], col: number[] = [], edge: number[] = [];
  for (let y = 0; y < h; y += stride) {
    let left = -1, right = -1;
    for (let x = 0; x < w; x++) if (opaque(x, y)) { if (left < 0) left = x; right = x; }
    if (left < 0) continue;
    const centre = (left + right) / 2, half = Math.max(1, (right - left) / 2 + 0.5);
    for (let x = 0; x < w; x += stride) {
      if (!opaque(x, y)) continue;
      const i = (y * w + x) * 4;
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      const u = (x - centre) / half;                       // -1..1 across this row
      const round = Math.sqrt(Math.max(0, 1 - u * u));     // 1 in the middle, 0 at the silhouette
      const jx = stride > 1 ? (Math.random() - 0.5) * stride : 0, jy = stride > 1 ? (Math.random() - 0.5) * stride : 0;
      pos.push((x + jx - w / 2) / h, (h / 2 - (y + jy)) / h, (round * half * 0.55 + lum * 3) / h);
      const t = smooth(0.1, 0.7, lum);
      const glow = 0.7 + 0.3 * t * t; // dark clothes stay dim blue, skin and highlights glow white
      col.push(...COBALT.map((c, k) => (c + (WHITE[k] - c) * t) * glow));
      edge.push(1 - round);
    }
  }
  return { count: pos.length / 3, positions: new Float32Array(pos), colors: new Float32Array(col), edge: new Float32Array(edge) };
}

export const scrollRotation = (progress: number): number => Math.min(1, Math.max(0, progress)) * MAX_TURN;

export interface PointerState { x: number; y: number; strength: number }

// Smoothed cursor for the force field: follows the pointer, ramps up over the hero, fades out when it leaves.
export function stepPointer(s: PointerState, target: { x: number; y: number; active: boolean }, dt: number): PointerState {
  const follow = Math.min(1, dt * 10);
  const ramp = Math.min(1, dt * (target.active ? 6 : 2.5));
  return {
    x: s.x + (target.x - s.x) * follow,
    y: s.y + (target.y - s.y) * follow,
    strength: s.strength + ((target.active ? 1 : 0) - s.strength) * ramp,
  };
}
