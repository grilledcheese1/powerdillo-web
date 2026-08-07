"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

// ── Material factories ────────────────────────────────────────────────────────

const orangeMat = () =>
  new THREE.LineBasicMaterial({ color: 0xff8c40, transparent: true, opacity: 0 });

// ── Geometry helpers ──────────────────────────────────────────────────────────

function edgeBox(w: number, h: number, d: number) {
  return new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
    orangeMat()
  );
}

function addBox(g: THREE.Group, w: number, h: number, d: number, x: number, y: number, z: number) {
  const m = edgeBox(w, h, d);
  m.position.set(x, y + h / 2, z);
  g.add(m);
}

function rawLines(pts: number[]): THREE.LineSegments {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, orangeMat());
}

function faceWindows(
  faceW: number, faceH: number, baseY: number,
  cols: number, rows: number, winW: number, winH: number,
  axis: "x" | "z", axisVal: number, center = 0
): number[] {
  const pts: number[] = [];
  const cs = faceW / cols, rs = faceH / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = center - faceW / 2 + (c + 0.5) * cs;
      const yB = baseY + (r + 0.15) * rs;
      const yT = yB + winH;
      const uL = u - winW / 2, uR = u + winW / 2;
      if (axis === "z") {
        pts.push(
          uL, yB, axisVal, uR, yB, axisVal,
          uR, yB, axisVal, uR, yT, axisVal,
          uR, yT, axisVal, uL, yT, axisVal,
          uL, yT, axisVal, uL, yB, axisVal,
        );
      } else {
        pts.push(
          axisVal, yB, uL, axisVal, yB, uR,
          axisVal, yB, uR, axisVal, yT, uR,
          axisVal, yT, uR, axisVal, yT, uL,
          axisVal, yT, uL, axisVal, yB, uL,
        );
      }
    }
  }
  return pts;
}

function addWindows(g: THREE.Group, ...args: Parameters<typeof faceWindows>) {
  g.add(rawLines(faceWindows(...args)));
}

// ── Building 1: Art Deco Skyscraper ──────────────────────────────────────────

function createBuilding(): THREE.Group {
  const g = new THREE.Group();

  // ─ Podium (y 0–0.4)
  addBox(g, 2.0, 0.4, 1.4, 0, 0, 0);
  addBox(g, 2.0, 0.03, 1.4, 0, 0.14, 0);
  addBox(g, 2.0, 0.03, 1.4, 0, 0.27, 0);

  g.add(rawLines([
    -0.22, 0, 0.701,  0.22, 0, 0.701,
    -0.22, 0, 0.701, -0.22, 0.28, 0.701,
     0.22, 0, 0.701,  0.22, 0.28, 0.701,
    -0.22, 0.28, 0.701, -0.1, 0.38, 0.701,
    -0.1,  0.38, 0.701,  0.1, 0.38, 0.701,
     0.1,  0.38, 0.701,  0.22, 0.28, 0.701,
     0,    0, 0.701,   0,   0.38, 0.701,
    -0.22, 0.28, 0.701, 0.22, 0.28, 0.701,
  ]));
  for (const sx of [-0.9, -0.3, 0.3, 0.9]) g.add(rawLines([sx, 0, 0.701, sx, 0.4, 0.701]));

  // ─ Mid setback (y 0.4–1.2)
  addBox(g, 1.4, 0.8, 1.0, 0, 0.4, 0);
  addBox(g, 1.5, 0.04, 1.1, 0, 0.4, 0);
  addBox(g, 1.45, 0.03, 1.05, 0, 0.42, 0);
  addWindows(g, 1.25, 0.78, 0.4, 5, 4, 0.14, 0.12, "z",  0.501);
  addWindows(g, 1.25, 0.78, 0.4, 5, 4, 0.14, 0.12, "z", -0.501);
  addWindows(g, 0.85, 0.78, 0.4, 3, 4, 0.14, 0.12, "x",  0.701);
  addWindows(g, 0.85, 0.78, 0.4, 3, 4, 0.14, 0.12, "x", -0.701);

  // ─ Primary tower (y 1.2–3.0)
  addBox(g, 0.9, 1.8, 0.7, 0, 1.2, 0);
  addBox(g, 1.0, 0.05, 0.78, 0, 1.2, 0);
  addBox(g, 0.95, 0.04, 0.74, 0, 1.23, 0);
  for (const [sx, sz] of [[-0.45,-0.35],[-0.45,0.35],[0.45,-0.35],[0.45,0.35]] as [number,number][]) {
    g.add(rawLines([sx, 1.2, sz, sx, 3.0, sz]));
  }
  for (const y of [1.65, 2.1, 2.55]) addBox(g, 0.9, 0.04, 0.7, 0, y, 0);
  addWindows(g, 0.82, 1.78, 1.2, 4, 10, 0.11, 0.12, "z",  0.351);
  addWindows(g, 0.82, 1.78, 1.2, 4, 10, 0.11, 0.12, "z", -0.351);
  addWindows(g, 0.62, 1.78, 1.2, 2, 10, 0.14, 0.12, "x",  0.451);
  addWindows(g, 0.62, 1.78, 1.2, 2, 10, 0.14, 0.12, "x", -0.451);
  addBox(g, 1.0, 0.06, 0.78, 0, 3.0, 0);
  addBox(g, 0.94, 0.04, 0.73, 0, 3.04, 0);
  addBox(g, 0.88, 0.04, 0.68, 0, 3.07, 0);

  // ─ Upper tower (y 3.1–4.5)
  addBox(g, 0.6, 1.4, 0.5, 0, 3.1, 0);
  for (const [sx, sz] of [[-0.3,-0.25],[-0.3,0.25],[0.3,-0.25],[0.3,0.25]] as [number,number][]) {
    g.add(rawLines([sx, 3.1, sz, sx, 4.5, sz]));
  }
  for (const y of [3.5, 3.9, 4.3]) addBox(g, 0.6, 0.035, 0.5, 0, y, 0);
  addWindows(g, 0.52, 1.38, 3.1, 3, 8, 0.1, 0.12, "z",  0.251);
  addWindows(g, 0.52, 1.38, 3.1, 3, 8, 0.1, 0.12, "z", -0.251);
  addWindows(g, 0.42, 1.38, 3.1, 2, 8, 0.12, 0.12, "x",  0.301);
  addWindows(g, 0.42, 1.38, 3.1, 2, 8, 0.12, 0.12, "x", -0.301);
  addBox(g, 0.7, 0.06, 0.58, 0, 4.5, 0);
  addBox(g, 0.65, 0.04, 0.54, 0, 4.54, 0);
  addBox(g, 0.6, 0.04, 0.5, 0, 4.57, 0);

  // ─ Pinnacle (y 4.6–5.08)
  addBox(g, 0.32, 0.48, 0.26, 0, 4.6, 0);
  addBox(g, 0.42, 0.05, 0.34, 0, 4.6, 0);
  addBox(g, 0.38, 0.04, 0.3, 0, 4.63, 0);
  addWindows(g, 0.24, 0.46, 4.6, 2, 4, 0.07, 0.08, "z",  0.131);
  addWindows(g, 0.24, 0.46, 4.6, 2, 4, 0.07, 0.08, "z", -0.131);
  addBox(g, 0.38, 0.05, 0.31, 0, 5.08, 0);
  addBox(g, 0.33, 0.04, 0.27, 0, 5.11, 0);

  // ─ Spire
  g.add(rawLines([
    0, 5.13, 0,    0, 5.95, 0,
    -0.05, 5.15, 0,  0.05, 5.15, 0,
     0, 5.15, -0.05,  0, 5.15, 0.05,
    -0.025, 5.55, 0,  0.025, 5.55, 0,
     0, 5.55, -0.025,  0, 5.55, 0.025,
  ]));

  return g;
}

// ── Building 2: Modern Glass Tower ───────────────────────────────────────────

function createGlassTower(): THREE.Group {
  const g = new THREE.Group();

  // ─ Lobby plinth
  addBox(g, 1.2, 0.05, 0.95, 0, 0, 0);

  // ─ Lobby base (y 0.05–0.42) with exposed colonnade columns
  addBox(g, 1.15, 0.37, 0.9, 0, 0.05, 0);
  for (const sx of [-0.44, -0.22, 0, 0.22, 0.44]) {
    g.add(rawLines([sx, 0.05, 0.451, sx, 0.42, 0.451]));
    g.add(rawLines([sx, 0.05, -0.451, sx, 0.42, -0.451]));
  }
  addBox(g, 1.15, 0.025, 0.9, 0, 0.40, 0); // lobby transom

  // ─ Tower body (y 0.42–5.42) — uniform rectangular prism, no setbacks
  addBox(g, 1.1, 5.0, 0.85, 0, 0.42, 0);

  // Floor plate lines (14 intermediate floors)
  const numFloors = 15;
  const floorStep = 5.0 / numFloors;
  for (let f = 1; f < numFloors; f++) {
    addBox(g, 1.1, 0.018, 0.85, 0, 0.42 + f * floorStep, 0);
  }

  // Curtain-wall windows — front & back (8 cols × 15 rows, tall thin panes)
  addWindows(g, 1.04, 5.0, 0.42, 8, 15, 0.08, 0.24, "z",  0.426);
  addWindows(g, 1.04, 5.0, 0.42, 8, 15, 0.08, 0.24, "z", -0.426);

  // Side curtain wall (2 cols × 15 rows)
  addWindows(g, 0.78, 5.0, 0.42, 2, 15, 0.2, 0.24, "x",  0.551);
  addWindows(g, 0.78, 5.0, 0.42, 2, 15, 0.2, 0.24, "x", -0.551);

  // ─ Parapet cap (y 5.42–5.50)
  addBox(g, 1.15, 0.06, 0.9, 0, 5.42, 0);
  addBox(g, 1.12, 0.04, 0.87, 0, 5.46, 0);

  // ─ Mechanical penthouse (y 5.50–5.85)
  addBox(g, 0.6, 0.35, 0.5, 0, 5.50, 0);
  for (let i = 0; i < 4; i++) {
    const lx = -0.22 + i * 0.15;
    g.add(rawLines([lx, 5.56, 0.251, lx, 5.82, 0.251]));
    g.add(rawLines([lx, 5.56, -0.251, lx, 5.82, -0.251]));
  }

  return g;
}

// ── Building 3: International Style Slab ─────────────────────────────────────

function createModernistSlab(): THREE.Group {
  const g = new THREE.Group();

  // ─ Deep podium (y 0–0.5)
  addBox(g, 2.2, 0.5, 1.5, 0, 0, 0);
  addBox(g, 2.2, 0.02, 1.5, 0, 0.18, 0);
  addBox(g, 2.2, 0.02, 1.5, 0, 0.36, 0);
  for (const sx of [-0.88, -0.44, 0, 0.44, 0.88]) {
    g.add(rawLines([sx, 0, 0.751, sx, 0.5, 0.751]));
  }

  // ─ Thin slab body (y 0.5–4.3): very wide, shallow depth
  addBox(g, 2.0, 3.8, 0.38, 0, 0.5, 0);

  // Horizontal spandrel lines at every floor
  const slabFloors = 13;
  const rowH = 3.8 / slabFloors;
  for (let f = 0; f <= slabFloors; f++) {
    addBox(g, 2.0, 0.025, 0.38, 0, 0.5 + f * rowH, 0);
  }

  // Ribbon windows — full-width horizontal strips (front & back)
  addWindows(g, 1.95, 3.8, 0.5, 1, slabFloors, 1.82, 0.19, "z",  0.191);
  addWindows(g, 1.95, 3.8, 0.5, 1, slabFloors, 1.82, 0.19, "z", -0.191);

  // Narrow end-face windows
  addWindows(g, 0.33, 3.8, 0.5, 1, slabFloors, 0.27, 0.19, "x",  1.01);
  addWindows(g, 0.33, 3.8, 0.5, 1, slabFloors, 0.27, 0.19, "x", -1.01);

  // ─ Roof parapet + cantilevered cornice
  addBox(g, 2.0, 0.08, 0.38, 0, 4.3, 0);
  addBox(g, 2.3, 0.05, 0.56, 0, 4.38, 0);

  // ─ Service / staircase towers at each end (y 0–4.5)
  // Inner edge of each tower aligns with outer edge of slab (x = ±1.0)
  addBox(g, 0.32, 4.5, 0.38, -1.16, 0, 0);
  addBox(g, 0.32, 4.5, 0.38,  1.16, 0, 0);

  // Tower caps
  addBox(g, 0.38, 0.07, 0.45, -1.16, 4.5, 0);
  addBox(g, 0.38, 0.07, 0.45,  1.16, 4.5, 0);

  // Tower windows (front & back of each pylon)
  addWindows(g, 0.28, 4.48, 0.0, 1, 12, 0.22, 0.19, "z",  0.191, -1.16);
  addWindows(g, 0.28, 4.48, 0.0, 1, 12, 0.22, 0.19, "z", -0.191, -1.16);
  addWindows(g, 0.28, 4.48, 0.0, 1, 12, 0.22, 0.19, "z",  0.191,  1.16);
  addWindows(g, 0.28, 4.48, 0.0, 1, 12, 0.22, 0.19, "z", -0.191,  1.16);

  return g;
}

// ── Spiral construction path (parameterized) ──────────────────────────────────

function buildSpiralPath(
  totalH: number,
  profileFn: (t: number) => [number, number]
): Float32Array {
  const pts: number[] = [];
  const levels = 80;
  const spl = 100;

  for (let lvl = 0; lvl <= levels; lvl++) {
    const t = lvl / levels;
    const y = t * totalH;
    const swirl = Math.pow(Math.max(0, 1 - t * 1.4), 1.6);
    const [bw, bd] = profileFn(t);

    for (let s = 0; s <= spl; s++) {
      const a = (s / spl) * Math.PI * 2;
      const cosA = Math.cos(a), sinA = Math.sin(a);
      const rScale = 1 / (Math.max(Math.abs(cosA) / bw, Math.abs(sinA) / bd) + 1e-9);
      const rx = cosA * rScale, rz = sinA * rScale;
      const r = Math.max(bw, bd) * (1.8 + swirl * 2);
      pts.push(
        cosA * r * swirl + rx * (1 - swirl),
        y,
        sinA * r * swirl + rz * (1 - swirl),
      );
    }
  }
  return new Float32Array(pts);
}

// ── Opacity helper ────────────────────────────────────────────────────────────

function setGroupOpacity(group: THREE.Group, opacity: number) {
  group.traverse((obj) => {
    const ls = obj as THREE.LineSegments;
    if (ls.isLineSegments) {
      (ls.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BlueprintAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveRef = useRef(false);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const cvs = canvas;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060e1e, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(3.5, 2.5, 5);
    camera.lookAt(0, 2.5, 0);

    // ── Grid floor ────────────────────────────────────────────────────────────
    const gridPts: number[] = [];
    const gs = 3.5, gd = 14, st = (gs * 2) / gd;
    for (let i = 0; i <= gd; i++) {
      const v = -gs + i * st;
      gridPts.push(-gs, 0, v, gs, 0, v, v, 0, -gs, v, 0, gs);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3));
    scene.add(new THREE.LineSegments(gridGeo,
      new THREE.LineBasicMaterial({ color: 0x1a3a6e, transparent: true, opacity: 0.35 })
    ));

    // ── Buildings (all three, all invisible initially) ────────────────────────
    const buildings = [createBuilding(), createGlassTower(), createModernistSlab()];
    buildings.forEach(b => scene.add(b));

    // ── Spiral paths, geometries and materials ────────────────────────────────
    const spiralProfiles: Array<[number, (t: number) => [number, number]]> = [
      [5.95, t => {
        if (t < 0.07) return [1.0, 0.7];
        if (t < 0.22) return [0.7, 0.5];
        if (t < 0.53) return [0.45, 0.35];
        if (t < 0.77) return [0.3, 0.25];
        if (t < 0.87) return [0.16, 0.13];
        return [0.03, 0.03];
      }],
      // Glass tower: uniform rectangle the whole way up
      [5.42, () => [0.55, 0.425]],
      // Modernist slab: wide-deep podium base, then very wide & thin slab
      [4.3, t => t < 0.12 ? [1.1, 0.75] : [1.0, 0.19]],
    ];

    const spiralDatas = spiralProfiles.map(([h, fn]) => buildSpiralPath(h, fn));
    const spiralGeos = spiralDatas.map(data => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(data, 3));
      geo.setDrawRange(0, 0);
      return geo;
    });
    const spiralMats = spiralDatas.map(() =>
      new THREE.LineBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0.85 })
    );
    spiralGeos.forEach((geo, i) => scene.add(new THREE.Line(geo, spiralMats[i])));
    const totalVerts = spiralDatas.map(d => d.length / 3);

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Rotation & interaction state ─────────────────────────────────────────
    const rot = { y: 0, x: 0.15 };
    let dragging = false, lastX = 0, lastY = 0;
    let autoRotate = true, hovered = false;

    // ── Loop state ────────────────────────────────────────────────────────────
    let currentTl: gsap.core.Timeline | null = null;
    let loopPaused = false;
    let deferred: (() => void) | null = null;

    function resumeLoop() {
      loopPaused = false;
      autoRotate = true;
      setHintVisible(false);
      interactiveRef.current = false;
      cvs.style.cursor = "default";
      if (deferred) { const fn = deferred; deferred = null; fn(); }
      else currentTl?.resume();
    }

    function runCycle(idx: number) {
      if (loopPaused) { deferred = () => runCycle(idx); return; }

      // Reset this building's spiral opacity so it's visible on every loop iteration
      spiralMats[idx].opacity = 0.85;

      const proxy = { count: 0, fade: 0, hold: 0, out: 0 };
      const tl = gsap.timeline();
      currentTl = tl;

      // Phase 1 — draw spiral (3.5 s)
      tl.to(proxy, {
        count: totalVerts[idx], duration: 3.5, ease: "none",
        onUpdate() { spiralGeos[idx].setDrawRange(0, Math.round(proxy.count)); },
      });

      // Phase 2 — crossfade spiral → building (1.2 s)
      tl.to(proxy, {
        fade: 1, duration: 1.2, ease: "power2.inOut",
        onUpdate() {
          spiralMats[idx].opacity = 0.85 * (1 - proxy.fade);
          setGroupOpacity(buildings[idx], proxy.fade);
        },
      });

      // Phase 3 — hold (shorter for the last building so the loop restart feels snappy)
      const holdDuration = idx === buildings.length - 1 ? 0.5 : 1.5;
      tl.to(proxy, { hold: 1, duration: holdDuration });

      // Phase 4 — fade building out (0.35 s)
      tl.to(proxy, {
        out: 1, duration: 0.35, ease: "power2.in",
        onUpdate() { setGroupOpacity(buildings[idx], 1 - proxy.out); },
      });

      tl.call(() => {
        spiralGeos[idx].setDrawRange(0, 0);
        runCycle((idx + 1) % buildings.length);
      });
    }

    // ── Pointer events ────────────────────────────────────────────────────────
    function onPointerEnter() {
      hovered = true;
      loopPaused = true;
      autoRotate = false;
      currentTl?.pause();
      interactiveRef.current = true;
      cvs.style.cursor = "grab";
      setHintVisible(true);
    }

    function onPointerLeave() {
      hovered = false;
      if (dragging) return;
      resumeLoop();
    }

    function onPointerDown(e: PointerEvent) {
      if (!interactiveRef.current) return;
      dragging = true;
      lastX = e.clientX; lastY = e.clientY;
      cvs.style.cursor = "grabbing";
      cvs.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      rot.y += (e.clientX - lastX) * 0.01;
      rot.x = Math.max(-0.5, Math.min(0.7, rot.x + (e.clientY - lastY) * 0.008));
      lastX = e.clientX; lastY = e.clientY;
    }

    function onPointerUp() {
      dragging = false;
      if (hovered) cvs.style.cursor = "grab";
      // if pointer is outside, pointerleave already fired and will resumeLoop
    }

    cvs.addEventListener("pointerenter", onPointerEnter);
    cvs.addEventListener("pointerleave", onPointerLeave);
    cvs.addEventListener("pointerdown", onPointerDown);
    cvs.addEventListener("pointermove", onPointerMove);
    cvs.addEventListener("pointerup", onPointerUp);

    // ── Render loop ───────────────────────────────────────────────────────────
    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);
      if (autoRotate) rot.y += 0.004;
      scene.rotation.y = rot.y;
      scene.rotation.x = rot.x;
      renderer.render(scene, camera);
    }
    animate();

    // ── Start building loop ───────────────────────────────────────────────────
    const startTimer = setTimeout(() => runCycle(0), 400);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(startTimer);
      ro.disconnect();
      cvs.removeEventListener("pointerenter", onPointerEnter);
      cvs.removeEventListener("pointerleave", onPointerLeave);
      cvs.removeEventListener("pointerdown", onPointerDown);
      cvs.removeEventListener("pointermove", onPointerMove);
      cvs.removeEventListener("pointerup", onPointerUp);
      currentTl?.kill();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Drag hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest text-blue-300/60 pointer-events-none transition-opacity duration-700"
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        drag to rotate
      </div>
    </div>
  );
}
