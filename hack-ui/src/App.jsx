import { useEffect, useRef, useState } from "react"
import { TopBar } from "./components/TopBar"
import { DrawerRail } from "./components/DrawerRail"
import { CardGrid } from "./components/CardGrid"
import { TerminalDrawer } from "./components/TerminalDrawer"
import { PasswordModal } from "./components/PasswordModal"
import { categories } from "./data/categories"
import { useTheme } from "./hooks/useTheme"
import { useRootPasswordSetting } from "./hooks/useRootPasswordSetting"
import { backendHealthUrl } from "./lib/backend"
import "./App.css"

let sessionCounter = 0

function App() {
  const { theme, toggleTheme } = useTheme()
  const { askForPassword, setAskForPassword } = useRootPasswordSetting()
  const [activeId, setActiveId] = useState(categories[0].id)
  const [status, setStatus] = useState("")
  const clearTimer = useRef(null)

  const [sessions, setSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [drawerCollapsed, setDrawerCollapsed] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState(340)
  const [pendingCard, setPendingCard] = useState(null)
  const [rootStatus, setRootStatus] = useState("checking backend…")

  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0]

  useEffect(() => {
    let cancelled = false
    fetch(backendHealthUrl())
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        setRootStatus(data.root ? "backend: root" : data.canSudo ? "backend: not root (sudo available)" : "backend: not root")
      })
      .catch(() => {
        if (!cancelled) setRootStatus("backend offline — see server/README")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openSession = (card, { elevate, password }) => {
    sessionCounter += 1
    const id = `t${sessionCounter}`
    setSessions((prev) => [...prev, { id, title: card.title, prefill: card.command, elevate, password }])
    setActiveSessionId(id)
    setDrawerCollapsed(false)
  }

  const handleCardClick = (card) => {
    setStatus(`opened terminal — ${card.title}`)
    if (clearTimer.current) clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => setStatus(""), 2600)

    if (askForPassword) {
      setPendingCard(card)
    } else {
      openSession(card, { elevate: false, password: undefined })
    }
  }

  const handlePasswordSubmit = (password) => {
    if (pendingCard) openSession(pendingCard, { elevate: true, password })
    setPendingCard(null)
  }

  const handlePasswordSkip = () => {
    if (pendingCard) openSession(pendingCard, { elevate: false, password: undefined })
    setPendingCard(null)
  }

  const closeSession = (id) => {
    setSessions((prev) => {
      const next = prev.filter((session) => session.id !== id)
      if (activeSessionId === id) {
        setActiveSessionId(next.length ? next[next.length - 1].id : null)
      }
      return next
    })
  }

  useEffect(() => () => clearTimer.current && clearTimeout(clearTimer.current), [])

  return (
    <div className="shell">
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        askForPassword={askForPassword}
        onToggleAskForPassword={() => setAskForPassword((v) => !v)}
      />
      <div className="shell__body">
        <DrawerRail categories={categories} activeId={activeId} onSelect={setActiveId} />
        <main className="shell__main">
          <CardGrid category={activeCategory} onCardClick={handleCardClick} />
          <div className="status-strip" role="status">
            {status}
          </div>
        </main>
      </div>
      <TerminalDrawer
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onClose={closeSession}
        collapsed={drawerCollapsed}
        onToggleCollapsed={setDrawerCollapsed}
        height={drawerHeight}
        onResizeHeight={setDrawerHeight}
        rootStatus={rootStatus}
      />
      {pendingCard && (
        <PasswordModal
          title={pendingCard.title}
          onSubmit={handlePasswordSubmit}
          onSkip={handlePasswordSkip}
          onCancel={() => setPendingCard(null)}
        />
      )}
    </div>
  )
}

export default App
