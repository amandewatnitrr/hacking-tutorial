import React, { useEffect, useState } from "react";

const THEME_KEY = "theme";
const LIGHT = "light";
const DARK = "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? DARK
        : LIGHT;
    } catch {
      return LIGHT;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === LIGHT ? DARK : LIGHT));

  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === LIGHT ? "🌙" : "☀️"}
    </button>
  );
}
