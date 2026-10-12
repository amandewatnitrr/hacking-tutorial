export function DrawerRail({ categories, activeId, onSelect }) {
  return (
    <nav className="drawer-rail" aria-label="Tool categories">
      {categories.map((category) => {
        const isActive = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            className={`drawer-tab${isActive ? " drawer-tab--active" : ""}`}
            style={!isActive ? { "--tab-hue": `var(--hue-${category.hue})`, "--tab-hue-bg": `var(--hue-${category.hue}-bg)` } : undefined}
            aria-pressed={isActive}
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </button>
        )
      })}
    </nav>
  )
}
