export function TopBar({ theme, onToggleTheme, askForPassword, onToggleAskForPassword, searchQuery, onSearchChange }) {
  return (
    <header className="top-bar">
      <img
        className="top-bar__logo"
        src={theme === "dark" ? "/logo-on-dark.svg" : "/logo-on-light.svg"}
        alt="hack-ui logo"
        width="24"
        height="24"
      />
      <span className="top-bar__title">hack-ui</span>
      <span className="top-bar__subtitle">rpi &middot; kali console</span>
      <div className="top-bar__search">
        <input
          type="search"
          className="top-bar__search-input"
          placeholder="search attacks — title or description…"
          aria-label="Search attacks by title or description"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="top-bar__search-clear"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
          >
            &times;
          </button>
        )}
      </div>
      <label className="root-toggle">
        <input type="checkbox" checked={askForPassword} onChange={onToggleAskForPassword} />
        ask for root password
      </label>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "dark" : "light"}
      </button>
    </header>
  )
}
