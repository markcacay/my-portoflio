import {
  WebGLRenderer, Scene, PerspectiveCamera, Points, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending, Group,
} from 'three';
import { buildParticles, scrollRotation } from './particles';

const SAMPLE = '/portrait/mark-sample.png';
const CAM_Z = 10, FOV = 35;
const FIGURE_SCALE = 1.3; // figure height relative to its slot
const VIEW_H = 2 * CAM_Z * Math.tan((FOV / 2) * (Math.PI / 180)); // world height visible at z = 0

const vert = /* glsl */ `
  attribute vec3 color; attribute float aEdge; attribute float aSeed;
  uniform float uTime; uniform float uScatter; uniform float uSize; uniform float uPR;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    vec3 p = position;
    float drift = 0.0015 + aEdge * aEdge * 0.012 + uScatter * (0.04 + aEdge * 0.12);
    p.x += sin(uTime * 0.6 + aSeed * 40.0) * drift;
    p.y += cos(uTime * 0.5 + aSeed * 30.0) * drift + uScatter * 0.08 * (aSeed - 0.3);
    p.z += sin(uTime * 0.7 + aSeed * 20.0) * drift * 2.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.8 + 0.4 * (0.5 + 0.5 * sin(uTime * 1.3 + aSeed * 60.0));
    gl_PointSize = uSize * uPR * twinkle * (${CAM_Z.toFixed(1)} / -mv.z);
    vColor = color;
    vAlpha = (1.0 - aEdge * 0.3) * (1.0 - uScatter * 0.7);
  }`;
const frag = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
  }`;
const dustVert = /* glsl */ `
  attribute float aSeed; uniform float uTime; uniform float uH; uniform float uPR;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y = mod(p.y - uTime * (0.05 + aSeed * 0.12) + uH * 0.5, uH) - uH * 0.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.0 + aSeed) * uPR;
    vA = 0.10 + aSeed * 0.18;
  }`;
const dustFrag = /* glsl */ `
  varying float vA;
  void main() { if (length(gl_PointCoord - 0.5) > 0.5) discard; gl_FragColor = vec4(vec3(0.62, 0.7, 0.85) * vA, vA); }`;

async function loadSample(): Promise<ImageData> {
  const img = new Image(); img.src = SAMPLE; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d', { willReadFrequently: true })!; ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
}

export async function createPortrait(hero: HTMLElement, slot: HTMLElement, stride: number): Promise<() => void> {
  const sample = await loadSample();
  const parts = buildParticles(sample, stride);

  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-canvas'; canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  const pr = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(pr);
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100); camera.position.z = CAM_Z;

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(parts.positions, 3));
  geo.setAttribute('color', new BufferAttribute(parts.colors, 3));
  geo.setAttribute('aEdge', new BufferAttribute(parts.edge, 1));
  geo.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: parts.count }, Math.random), 1));
  const mat = new ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScatter: { value: 0 }, uSize: { value: 2 }, uPR: { value: pr } },
  });
  const figure = new Group(); scene.add(figure);
  figure.add(new Points(geo, mat));

  const DUST = 2200;
  const dustGeo = new BufferGeometry(), dustPos = new Float32Array(DUST * 3);
  const dustMat = new ShaderMaterial({
    vertexShader: dustVert, fragmentShader: dustFrag, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uH: { value: VIEW_H }, uPR: { value: pr } },
  });
  dustGeo.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: DUST }, Math.random), 1));
  const dust = new Points(dustGeo, dustMat); scene.add(dust);

  let progress = 0;
  const layout = () => {
    const hr = hero.getBoundingClientRect(), sr = slot.getBoundingClientRect();
    renderer.setSize(hr.width, hr.height, false);
    camera.aspect = hr.width / hr.height; camera.updateProjectionMatrix();
    const pxToWorld = VIEW_H / hr.height, viewW = VIEW_H * camera.aspect;
    // Full-length photo: draw it taller than the slot, head at the top, so the hero edge crops the legs.
    const figH = sr.height * FIGURE_SCALE;
    figure.scale.setScalar(figH * pxToWorld);
    figure.position.set((sr.left + sr.width / 2 - hr.left) * pxToWorld - viewW / 2, VIEW_H / 2 - (sr.top + figH / 2 - hr.top) * pxToWorld, 0);
    mat.uniforms.uSize.value = Math.max(1, (figH / (sample.height / stride)) * 1.3);
    // Faint falling dust in loose vertical columns across the hero.
    const cols = 9;
    for (let i = 0; i < DUST; i++) {
      const col = Math.floor(Math.random() * cols);
      dustPos[i * 3] = ((col + 0.5) / cols - 0.5) * viewW + (Math.random() - 0.5) * viewW * 0.04;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * VIEW_H;
      dustPos[i * 3 + 2] = -Math.random() * 3;
    }
    dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3));
  };
  const onScroll = () => { const r = hero.getBoundingClientRect(); progress = Math.min(1, Math.max(0, -r.top / (r.height * 0.85))); };
  const ptr = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => { ptr.x = e.clientX / innerWidth - 0.5; ptr.y = e.clientY / innerHeight - 0.5; };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('pointermove', onMove, { passive: true });
  const ro = new ResizeObserver(layout); ro.observe(hero); layout(); onScroll();

  let visible = true, raf = 0, last = performance.now(), time = 0;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }); io.observe(hero);
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;
    const targetY = -0.18 + scrollRotation(progress) + ptr.x * 0.25;
    figure.rotation.y += (targetY - figure.rotation.y) * 0.08;
    figure.rotation.x += (ptr.y * 0.08 - figure.rotation.x) * 0.08;
    mat.uniforms.uTime.value = time; dustMat.uniforms.uTime.value = time;
    mat.uniforms.uScatter.value += (Math.max(0, (progress - 0.35) / 0.65) - mat.uniforms.uScatter.value) * 0.1;
    renderer.render(scene, camera);
  }
  const onVis = () => { if (!document.hidden) { last = performance.now(); loop(); } };
  document.addEventListener('visibilitychange', onVis);

  const dispose = () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    removeEventListener('scroll', onScroll); removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
    canvas.removeEventListener('webglcontextlost', onLost);
    geo.dispose(); mat.dispose(); dustGeo.dispose(); dustMat.dispose(); renderer.dispose();
    canvas.remove(); hero.classList.remove('is-3d');
  };
  // GPU reset or tab eviction: drop the scene and let the poster show again.
  const onLost = (e: Event) => { e.preventDefault(); dispose(); };
  canvas.addEventListener('webglcontextlost', onLost);
  loop();
  requestAnimationFrame(() => hero.classList.add('is-3d'));
  return dispose;
}
