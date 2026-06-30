export default function BlurText({ children, className = "" }) {
  return (
    <span className={`blur-text ${className}`}>
      {Array.from(children).map((char, index) => (
        <span key={`${char}-${index}`} style={{ "--blur-index": index }}>
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}
