import { useState } from "react";

export default function SpotlightCard({ children, className = "" }) {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const updateSpotlight = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <article
      className={`spotlight-card ${className}`}
      onMouseMove={updateSpotlight}
      style={{ "--spotlight-x": `${spotlight.x}%`, "--spotlight-y": `${spotlight.y}%` }}
    >
      {children}
    </article>
  );
}
