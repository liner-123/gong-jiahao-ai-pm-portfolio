import { useEffect, useRef, useState } from "react";

export default function TextType({ text, className = "" }) {
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      setHasStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) {
      setVisibleLength(0);
      return undefined;
    }

    setVisibleLength(0);
    const chars = Array.from(text);
    let index = 0;

    const interval = window.setInterval(() => {
      index += 1;
      setVisibleLength(index);
      if (index >= chars.length) {
        window.clearInterval(interval);
      }
    }, 42);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasStarted, text]);

  return (
    <span ref={elementRef} className={`text-type ${className}`}>
      {Array.from(text).slice(0, visibleLength).join("")}
      {hasStarted && <span className="text-type-cursor" aria-hidden="true" />}
    </span>
  );
}
