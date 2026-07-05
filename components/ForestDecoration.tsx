"use client";

import { useEffect, useRef, useState } from "react";

function ForestCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Fireflies ──
    interface Firefly {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number; alphaDir: number;
      hue: number; // 80-140 green range
      glowSize: number;
    }
    const FIREFLY_COUNT = 55;
    const fireflies: Firefly[] = Array.from({ length: FIREFLY_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.8,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      hue: 90 + Math.random() * 50,
      glowSize: Math.random() * 8 + 4,
    }));

    // ── Pre-render Blurred Leaves ──
    const leafColors = [
      [55, 140, 38],   // mid green
      [40, 120, 28],   // dark green
      [70, 160, 45],   // bright green
      [100, 150, 35],  // yellow-green
      [140, 110, 30],  // golden-brown (autumn)
      [60, 130, 40],   // forest green
    ];
    
    const preRenderedLeaves: HTMLCanvasElement[] = [];
    leafColors.forEach(([r, g, b]) => {
      const off = document.createElement("canvas");
      off.width = 64;
      off.height = 64;
      const octx = off.getContext("2d");
      if (octx) {
        octx.translate(32, 32);
        octx.filter = "blur(2px)";
        const len = 40;
        const width = len * 0.42;
        octx.beginPath();
        octx.moveTo(0, -len / 2);
        octx.quadraticCurveTo(width, 0, 0, len / 2);
        octx.quadraticCurveTo(-width, 0, 0, -len / 2);
        octx.closePath();
        octx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        octx.fill();
      }
      preRenderedLeaves.push(off);
    });

    // ── Falling Leaves ──
    interface FallingLeaf {
      x: number; y: number;
      vx: number; vy: number;
      angle: number; angularV: number;
      len: number; width: number;
      colorIndex: number;
      alpha: number;
      wobble: number; wobbleSpeed: number;
      // repulsion
      rx: number; ry: number;
    }

    const LEAF_COUNT = 22;
    const makeLeaf = (): FallingLeaf => {
      const colorIndex = Math.floor(Math.random() * leafColors.length);
      return {
        x: Math.random() * W,
        y: -Math.random() * H * 0.5 - 30,
        vx: (Math.random() - 0.5) * 0.7,
        vy: Math.random() * 0.8 + 0.4,
        angle: Math.random() * Math.PI * 2,
        angularV: (Math.random() - 0.5) * 0.025,
        len: Math.random() * 20 + 12,
        width: 0,
        colorIndex,
        alpha: Math.random() * 0.4 + 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.008,
        rx: 0, ry: 0,
      };
    };
    const leaves: FallingLeaf[] = Array.from({ length: LEAF_COUNT }, makeLeaf);
    leaves.forEach(l => { l.width = l.len * 0.42; l.y = Math.random() * H; });

    const REPEL_RADIUS = 120;
    const REPEL_FORCE = 4.5;

    let t = 0;
    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Draw & update fireflies ──
      for (const f of fireflies) {
        // Wander
        f.vx += (Math.random() - 0.5) * 0.04;
        f.vy += (Math.random() - 0.5) * 0.04;
        // Clamp speed
        const spd = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
        if (spd > 0.9) { f.vx = (f.vx / spd) * 0.9; f.vy = (f.vy / spd) * 0.9; }

        // Mouse repulsion
        const dx = f.x - mx;
        const dy = f.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          f.vx += (dx / dist) * force * REPEL_FORCE * 0.08;
          f.vy += (dy / dist) * force * REPEL_FORCE * 0.08;
        }

        f.x += f.vx;
        f.y += f.vy;

        // Wrap edges
        if (f.x < -10) f.x = W + 10;
        if (f.x > W + 10) f.x = -10;
        if (f.y < -10) f.y = H + 10;
        if (f.y > H + 10) f.y = -10;

        // Pulse alpha
        f.alpha += f.alphaDir * (0.008 + Math.random() * 0.005);
        if (f.alpha > 1) { f.alpha = 1; f.alphaDir = -1; }
        if (f.alpha < 0.05) { f.alpha = 0.05; f.alphaDir = 1; }

        // Draw glow
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowSize);
        grd.addColorStop(0, `hsla(${f.hue}, 90%, 75%, ${f.alpha})`);
        grd.addColorStop(0.4, `hsla(${f.hue}, 80%, 60%, ${f.alpha * 0.5})`);
        grd.addColorStop(1, `hsla(${f.hue}, 70%, 50%, 0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${f.hue}, 100%, 90%, ${f.alpha})`;
        ctx.fill();
      }

      // ── Draw & update falling leaves ──
      ctx.save();
      
      for (const l of leaves) {
        // Wobble horizontal drift (simulates air)
        l.wobble += l.wobbleSpeed;
        const windX = Math.sin(l.wobble) * 0.5;

        // Mouse repulsion for leaves
        const dx = l.x - mx;
        const dy = l.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          l.rx += (dx / dist) * force * REPEL_FORCE * 0.12;
          l.ry += (dy / dist) * force * REPEL_FORCE * 0.12;
        }

        // Decay repulsion velocity
        l.rx *= 0.92;
        l.ry *= 0.92;

        l.x += l.vx + windX + l.rx;
        l.y += l.vy + l.ry;
        l.angle += l.angularV;
        
        // Apply stronger friction to rotation so it doesn't spin forever
        l.angularV *= 0.94;

        // Reset when off screen
        if (l.y > H + 40 || l.x < -80 || l.x > W + 80) {
          const reset = makeLeaf();
          Object.assign(l, reset);
          l.width = l.len * 0.42;
        }

        // Draw pre-rendered blurred leaf
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.angle);
        ctx.globalAlpha = l.alpha * 0.6;
        const scale = l.len / 40; // since pre-rendered leaf is len=40
        const size = 64 * scale;
        ctx.drawImage(preRenderedLeaves[l.colorIndex], -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

export default function ForestDecoration() {
  const mouse    = useRef({ x: 0.5, y: 0.5 });
  const current  = useRef({ x: 0.5, y: 0.5 });
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      // Smooth lerp toward actual mouse position
      const LERP = 0.055;
      current.current.x += (mouse.current.x - current.current.x) * LERP;
      current.current.y += (mouse.current.y - current.current.y) * LERP;

      // Parallax offset: ±18px horizontal, ±10px vertical
      // No more left forest to move
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem("faunafy_animations");
      if (saved !== null) {
        setEnabled(saved === "true");
      }
    };
    checkSettings();
    window.addEventListener("faunafy_settings_changed", checkSettings);
    return () => window.removeEventListener("faunafy_settings_changed", checkSettings);
  }, []);

  return (
    <>
      {enabled && <ForestCanvas />}
    </>
  );
}
