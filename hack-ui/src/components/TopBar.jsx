export function TopBar({ theme, onToggleTheme, askForPassword, onToggleAskForPassword }) {
  return (
    <header className="top-bar">
      <span className="top-bar__title">hack-ui</span>
      <span className="top-bar__subtitle">rpi &middot; kali console</span>
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
