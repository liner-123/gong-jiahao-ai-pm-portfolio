import { useEffect, useRef } from "react";

export default function Threads({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;

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

    const drawThread = (yBase, color, phase, thickness) => {
      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 18) {
        const y =
          yBase +
          Math.sin(x * 0.012 + frame * 0.012 + phase) * 18 +
          Math.cos(x * 0.02 - frame * 0.008 + phase) * 10;
        if (x === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.stroke();
    };

    const draw = () => {
      frame += media.matches ? 0.2 : 1;
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(255,255,255,0.88)");
      gradient.addColorStop(0.52, "rgba(246,248,252,0.72)");
      gradient.addColorStop(1, "rgba(237,241,249,0.88)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "multiply";
      drawThread(height * 0.18, "rgba(41,142,245,0.13)", 0.2, 1.4);
      drawThread(height * 0.34, "rgba(23,23,24,0.08)", 1.6, 1.1);
      drawThread(height * 0.56, "rgba(83,108,172,0.11)", 2.8, 1.3);
      drawThread(height * 0.78, "rgba(41,142,245,0.1)", 4.1, 1.2);
      ctx.globalCompositeOperation = "source-over";

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`threads-canvas ${className}`} aria-hidden="true" />;
}
