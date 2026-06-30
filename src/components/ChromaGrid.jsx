export default function ChromaGrid({ items, activeId, onSelect }) {
  return (
    <div className="chroma-grid" aria-label="企业与比赛产品案例">
      {items.map((item) => (
        <button
          className={`chroma-card ${item.id === activeId ? "is-active" : ""}`}
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{ "--chroma": item.chroma }}
          type="button"
          aria-pressed={item.id === activeId}
        >
          <span className="chroma-glow" aria-hidden="true" />
          <img src={item.image} alt={`${item.title} 封面`} />
          <span className="chroma-case">{item.eyebrow}</span>
          <strong>{item.title}</strong>
          <em>{item.description}</em>
          <span className="chroma-tags">
            {item.proof.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
          <span className="chroma-action">查看详情</span>
        </button>
      ))}
    </div>
  );
}
