import { useEffect, useRef } from "react";

export default function LiquidEther({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0.35, y: 0.5, active: false };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawBlob = (cx, cy, radius, color, alpha, wobble) => {
      const points = 72;
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const angle = (i / points) * Math.PI * 2;
        const wave =
          Math.sin(angle * 3 + frame * 0.012 + wobble) * 0.14 +
          Math.cos(angle * 5 - frame * 0.009 + wobble) * 0.08;
        const r = radius * (1 + wave);
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.1);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      frame += media.matches ? 0.15 : 1;
      ctx.clearRect(0, 0, width, height);

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#f3f4f9");
      base.addColorStop(0.42, "#dfe1f0");
      base.addColorStop(1, "#aeb1cc");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      const px = pointer.active ? pointer.x : 0.38 + Math.sin(frame * 0.006) * 0.1;
      const py = pointer.active ? pointer.y : 0.48 + Math.cos(frame * 0.005) * 0.08;

      drawBlob(width * px, height * py, Math.min(width, height) * 0.5, "#ffffff", 0.55, 0);
      drawBlob(width * (0.72 + Math.sin(frame * 0.004) * 0.08), height * 0.34, Math.min(width, height) * 0.36, "#c6c9df", 0.48, 1.7);
      drawBlob(width * (0.18 + Math.cos(frame * 0.005) * 0.07), height * 0.7, Math.min(width, height) * 0.42, "#aeb1cc", 0.42, 2.6);
      drawBlob(width * (0.5 + Math.sin(frame * 0.007) * 0.12), height * 0.85, Math.min(width, height) * 0.28, "#298ef5", 0.11, 4.2);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < 10; i += 1) {
        const x = ((i * 137 + frame * 0.22) % (width + 240)) - 120;
        const y = height * (0.18 + ((i * 47) % 70) / 100);
        ctx.beginPath();
        ctx.ellipse(x, y, 180, 34, -0.28, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`liquid-ether-canvas ${className}`} aria-hidden="true" />;
}
