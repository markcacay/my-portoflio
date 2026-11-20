import {
  WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Group, Mesh, SphereGeometry,
  MeshStandardMaterial, TubeGeometry, QuadraticBezierCurve3, Vector3, Vector2, Raycaster, Color,
} from 'three';
import { nodes, wires, type Tone } from '../data/integrations';

const COLORS: Record<Tone, string> = { ink: '#18212B', far: '#5E6B78', cobalt: '#2F5BFF' };
const toWorld = (x: number, y: number, z: number) => new Vector3((x - 300) / 70, -(y - 290) / 70, z);

export function createScene(parent: HTMLElement): () => void {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  parent.appendChild(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 15);
  scene.add(new HemisphereLight('#ffffff', '#c9d3dc', 1.6));
  const sun = new DirectionalLight('#ffffff', 1.8); sun.position.set(-4, 6, 8); scene.add(sun);

  const group = new Group(); scene.add(group);
  const byId = new Map<string, { mesh: Mesh; pos: Vector3; href: string; i: number }>();
  nodes.forEach((n, i) => {
    const pos = toWorld(n.x, n.y, n.z);
    const mesh = new Mesh(new SphereGeometry(n.r / 70, 32, 16), new MeshStandardMaterial({ color: COLORS[n.tone], roughness: 0.42, metalness: 0.08 }));
    mesh.position.copy(pos); mesh.userData.i = i; group.add(mesh);
    byId.set(n.id, { mesh, pos, href: n.href, i });
  });
  const pulseMat = new MeshStandardMaterial({ color: '#FFB020', emissive: new Color('#FFB020'), emissiveIntensity: 0.4 });
  const pulses: { mesh: Mesh; curve: QuadraticBezierCurve3; t: number; speed: number }[] = [];
  wires.forEach(([a, b, cx, cy, dashed], i) => {
    const A = byId.get(a)!.pos, B = byId.get(b)!.pos;
    const ctrl = toWorld(cx, cy, (A.z + B.z) / 2 + 0.3);
    const curve = new QuadraticBezierCurve3(A, ctrl, B);
    const toB = nodes.find((n) => n.id === b)!;
    const mat = new MeshStandardMaterial({ color: COLORS[toB.tone], roughness: 0.5, transparent: !!dashed, opacity: dashed ? 0.45 : 1 });
    group.add(new Mesh(new TubeGeometry(curve, 48, toB.tone === 'far' ? 0.018 : 0.03, 8), mat));
    if (!dashed && i % 2 === 0) {
      const p = new Mesh(new SphereGeometry(0.08, 16, 8), pulseMat); group.add(p);
      pulses.push({ mesh: p, curve, t: Math.random(), speed: 0.12 + Math.random() * 0.08 });
    }
  });

  // HTML labels: real links to each case study, positioned over the projected node.
  const layer = document.createElement('div'); layer.className = 'hero-labels'; parent.appendChild(layer);
  const tip = document.createElement('div'); tip.className = 'hero-tip'; tip.setAttribute('role', 'status');
  (parent.parentElement ?? parent).appendChild(tip); // sits under the map, sharing the hint's slot
  const labels = nodes.map((n, i) => {
    const a = document.createElement('a');
    a.href = n.href; a.className = `hero-label tone-${n.tone}${n.id === 'wp' ? ' is-hub' : ''}`; a.textContent = n.label;
    a.setAttribute('aria-label', `${n.label}: ${n.project}. ${n.line}`);
    const show = () => setActive(i); a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
    a.addEventListener('mouseleave', () => setActive(-1)); a.addEventListener('blur', () => setActive(-1));
    layer.appendChild(a); return a;
  });
  let active = -1;
  function setActive(i: number) {
    active = i;
    byId.forEach(({ mesh }) => mesh.scale.setScalar(mesh.userData.i === i ? 1.18 : 1));
    if (i < 0) { tip.classList.remove('show'); return; }
    const n = nodes[i];
    tip.innerHTML = '';
    const h = document.createElement('strong'); h.textContent = n.project;
    const p = document.createElement('span'); p.textContent = n.line;
    tip.append(h, p); tip.classList.add('show');
  }

  const ray = new Raycaster(), ptr = new Vector2(), tilt = new Vector2();
  const meshes = [...byId.values()].map((v) => v.mesh);
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    tilt.set(ptr.x * 0.25, ptr.y * 0.15);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(meshes)[0];
    const i = hit ? (hit.object.userData.i as number) : -1;
    canvas.style.cursor = i >= 0 ? 'pointer' : '';
    if (i !== active) setActive(i);
  };
  const onClick = () => { if (active >= 0) location.href = nodes[active].href; };
  canvas.addEventListener('pointermove', onMove); canvas.addEventListener('click', onClick);

  const v = new Vector3();
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = parent;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w / h < 0.95 ? 17 : 15; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(parent); resize();

  let visible = true, raf = 0, last = performance.now(), time = 0;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }); io.observe(parent);
  function loop() {
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now; time += dt;
    group.rotation.y += (Math.sin(time * 0.25) * 0.35 + tilt.x - group.rotation.y) * 0.05;
    group.rotation.x += (-tilt.y - group.rotation.x) * 0.05;
    for (const p of pulses) { p.t = (p.t + dt * p.speed) % 1; p.mesh.position.copy(p.curve.getPoint(p.t)); }
    renderer.render(scene, camera);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    nodes.forEach((n, i) => {
      v.copy(byId.get(n.id)!.pos).applyMatrix4(group.matrixWorld).project(camera);
      labels[i].style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h + (n.r / 70) * 34 + 6}px) translateX(-50%)`;
    });
  }
  const onVis = () => { if (!document.hidden) { last = performance.now(); loop(); } };
  document.addEventListener('visibilitychange', onVis);
  loop();
  requestAnimationFrame(() => parent.classList.add('is-3d'));

  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    scene.traverse((o) => { if (o instanceof Mesh) { o.geometry.dispose(); (o.material as MeshStandardMaterial).dispose(); } });
    renderer.dispose(); canvas.remove(); layer.remove(); tip.remove(); parent.classList.remove('is-3d');
  };
}
