export function CardGrid({ category, onCardClick }) {
  return (
    <section className="card-grid-wrap" aria-labelledby="active-category-heading">
      <h2 id="active-category-heading" className="card-grid-heading">
        {category.label}
      </h2>
      <div className="card-grid">
        {category.cards.map((card) => (
          <button
            type="button"
            key={card.tag}
            className="index-card"
            onClick={() => onCardClick(card)}
          >
            <span className="index-card__title">{card.title}</span>
            <span className="index-card__tag mono">{card.tag}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
