import { useState } from "react";

export default function TargetCursor({ children, className = "" }) {
  const [cursor, setCursor] = useState({ active: false, x: 0, y: 0 });

  const updateCursor = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursor({
      active: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div
      className={`target-cursor-wrap ${className}`}
      onMouseMove={updateCursor}
      onMouseLeave={() => setCursor((current) => ({ ...current, active: false }))}
      style={{ "--target-x": `${cursor.x}px`, "--target-y": `${cursor.y}px` }}
    >
      <span className={`target-cursor ${cursor.active ? "is-active" : ""}`} aria-hidden="true" />
      {children}
    </div>
  );
}
