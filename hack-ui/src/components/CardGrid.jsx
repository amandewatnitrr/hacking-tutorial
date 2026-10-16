export function CardGrid({ category, searchResults, onCardClick }) {
  const isSearch = searchResults != null

  return (
    <section className="card-grid-wrap" aria-labelledby="active-category-heading">
      <h2 id="active-category-heading" className="card-grid-heading">
        {isSearch
          ? `${searchResults.length} match${searchResults.length === 1 ? "" : "es"}`
          : category.label}
      </h2>
      {isSearch && searchResults.length === 0 ? (
        <p className="card-grid-empty">no attacks match that search</p>
      ) : (
        <div className="card-grid" key={isSearch ? "search" : category.id}>
          {(isSearch ? searchResults : category.cards).map((card) => (
            <button
              type="button"
              key={card.tag}
              className="index-card"
              style={isSearch ? { "--tab-hue": `var(--hue-${card.categoryHue})`, "--tab-hue-bg": `var(--hue-${card.categoryHue}-bg)` } : undefined}
              onClick={() => onCardClick(card)}
            >
              {isSearch && <span className="index-card__category">{card.categoryLabel}</span>}
              <span className="index-card__title">{card.title}</span>
              {card.description && <span className="index-card__description">{card.description}</span>}
              <span className="index-card__tag mono">{card.tag}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
