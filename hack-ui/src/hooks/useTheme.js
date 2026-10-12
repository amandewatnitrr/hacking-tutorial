import { useEffect, useState } from "react"

const STORAGE_KEY = "hack-ui-theme"

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
}

export function useTheme() {
  const [theme, setTheme] = useState(() => readStoredTheme() || (prefersDark() ? "dark" : "light"))

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // private browsing / blocked storage: theme still applies for this session
    }
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"))

  return { theme, toggleTheme }
}
