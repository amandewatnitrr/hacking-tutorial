import { useEffect, useRef, useState } from "react"
import { TopBar } from "./components/TopBar"
import { DrawerRail } from "./components/DrawerRail"
import { CardGrid } from "./components/CardGrid"
import { TerminalDrawer } from "./components/TerminalDrawer"
import { PasswordModal } from "./components/PasswordModal"
import { categories } from "./data/categories"
import { useTheme } from "./hooks/useTheme"
import { useRootPasswordSetting } from "./hooks/useRootPasswordSetting"
import { backendHealthUrl, backendSessionsUrl } from "./lib/backend"
import { loadStoredSessions, saveStoredSessions } from "./lib/sessionStore"
import "./App.css"

const terminalCounter = { current: 1 }

function App() {
  const { theme, toggleTheme } = useTheme()
  const { askForPassword, setAskForPassword } = useRootPasswordSetting()
  const [activeId, setActiveId] = useState(categories[0].id)
  const [status, setStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const clearTimer = useRef(null)

  const [sessions, setSessions] = useState([])
  const [paneOf, setPaneOf] = useState({})
  const [activePane, setActivePane] = useState({ A: null, B: null })
  const [paneCount, setPaneCount] = useState(1)
  const [focusedPane, setFocusedPane] = useState("A")
  const [hydrated, setHydrated] = useState(false)
  const endOnCloseIds = useRef(new Set())

  const [drawerCollapsed, setDrawerCollapsed] = useState(false)
  const [drawerHeight, setDrawerHeight] = useState(340)
  const [pendingCard, setPendingCard] = useState(null)
  const [rootStatus, setRootStatus] = useState("checking backend…")

  const activeCategory = categories.find((category) => category.id === activeId) ?? categories[0]

  const trimmedQuery = searchQuery.trim().toLowerCase()
  const searchResults = trimmedQuery
    ? categories.flatMap((category) =>
        category.cards
          .filter((card) =>
            [card.title, card.description, card.tag].some((field) =>
              field?.toLowerCase().includes(trimmedQuery)
            )
          )
          .map((card) => ({ ...card, categoryLabel: category.label, categoryHue: category.hue }))
      )
    : null

  const handleSelectCategory = (id) => {
    const applySelection = () => {
      setSearchQuery("")
      setActiveId(id)
    }
    if (id === activeId && !searchQuery) return
    if (document.startViewTransition) {
      document.startViewTransition(applySelection)
    } else {
      applySelection()
    }
  }

  // Restore sessions the backend is still running (survives a page refresh):
  // read what we remember from localStorage, then confirm each one is still
  // alive server-side before reattaching — a dead id is just dropped.
  useEffect(() => {
    let cancelled = false
    const stored = loadStoredSessions()
    if (!stored?.sessions?.length) {
      setHydrated(true)
      return
    }

    fetch(backendSessionsUrl())
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const aliveIds = new Set(data.ok ? data.sessions.map((s) => s.id) : [])
        const restored = stored.sessions.filter((s) => aliveIds.has(s.id))
        if (!restored.length) return

        const prunedPaneOf = {}
        for (const s of restored) {
          prunedPaneOf[s.id] = stored.paneOf?.[s.id] === "B" ? "B" : "A"
        }
        const pickActive = (paneId) => {
          const storedActive = stored.activePane?.[paneId]
          if (storedActive && aliveIds.has(storedActive) && prunedPaneOf[storedActive] === paneId) {
            return storedActive
          }
          const fallback = restored.find((s) => prunedPaneOf[s.id] === paneId)
          return fallback ? fallback.id : null
        }

        setSessions(restored.map((s) => ({ ...s, password: undefined })))
        setPaneOf(prunedPaneOf)
        setPaneCount(stored.paneCount === 2 ? 2 : 1)
        setActivePane({ A: pickActive("A"), B: pickActive("B") })
        setDrawerCollapsed(false)
        setStatus(`restored ${restored.length} session${restored.length === 1 ? "" : "s"}`)
        if (clearTimer.current) clearTimeout(clearTimer.current)
        clearTimer.current = setTimeout(() => setStatus(""), 2600)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Mirror open sessions + pane layout to localStorage so a refresh can
  // reattach them. Gated on `hydrated` so the initial empty state doesn't
  // stomp on what we're about to restore above.
  useEffect(() => {
    if (!hydrated) return
    saveStoredSessions({
      sessions: sessions.map(({ id, title, prefill, elevate }) => ({ id, title, prefill, elevate })),
      paneOf,
      activePane,
      paneCount,
    })
  }, [hydrated, sessions, paneOf, activePane, paneCount])

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
    const id = crypto.randomUUID()
    const pane = focusedPane
    setSessions((prev) => [...prev, { id, title: card.title, prefill: card.command ?? "", elevate, password }])
    setPaneOf((prev) => ({ ...prev, [id]: pane }))
    setActivePane((prev) => ({ ...prev, [pane]: id }))
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

  const handleNewTerminal = () => {
    handleCardClick({ title: `Terminal ${terminalCounter.current++}`, command: "" })
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
    endOnCloseIds.current.add(id)
    setSessions((prev) => prev.filter((session) => session.id !== id))
    setPaneOf((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setActivePane((prev) => {
      const next = { ...prev }
      for (const paneId of ["A", "B"]) {
        if (next[paneId] === id) {
          const remaining = sessions.filter((session) => session.id !== id && paneOf[session.id] === paneId)
          next[paneId] = remaining.length ? remaining[remaining.length - 1].id : null
        }
      }
      return next
    })
  }

  const selectTab = (paneId, id) => {
    setActivePane((prev) => ({ ...prev, [paneId]: id }))
    setFocusedPane(paneId)
  }

  const moveSessionToPane = (id, targetPane) => {
    const sourcePane = targetPane === "A" ? "B" : "A"
    setPaneOf((prev) => ({ ...prev, [id]: targetPane }))
    setActivePane((prev) => {
      const next = { ...prev }
      if (next[sourcePane] === id) {
        const remaining = sessions.filter((session) => session.id !== id && paneOf[session.id] === sourcePane)
        next[sourcePane] = remaining.length ? remaining[remaining.length - 1].id : null
      }
      next[targetPane] = id
      return next
    })
    setFocusedPane(targetPane)
  }

  const toggleSplit = () => {
    if (paneCount === 2) {
      setPaneOf((prev) => {
        const next = { ...prev }
        for (const key of Object.keys(next)) {
          if (next[key] === "B") next[key] = "A"
        }
        return next
      })
      setActivePane((prev) => ({ A: prev.A ?? prev.B, B: null }))
      setPaneCount(1)
      setFocusedPane("A")
    } else {
      setPaneCount(2)
    }
  }

  useEffect(() => () => clearTimer.current && clearTimeout(clearTimer.current), [])

  const panes = {
    A: { tabs: sessions.filter((session) => paneOf[session.id] === "A"), activeId: activePane.A },
    B: { tabs: sessions.filter((session) => paneOf[session.id] === "B"), activeId: activePane.B },
  }

  return (
    <div className="shell">
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        askForPassword={askForPassword}
        onToggleAskForPassword={() => setAskForPassword((v) => !v)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="shell__body">
        <DrawerRail categories={categories} activeId={activeId} onSelect={handleSelectCategory} />
        <main className="shell__main">
          <CardGrid category={activeCategory} searchResults={searchResults} onCardClick={handleCardClick} />
          <div className="status-strip" role="status">
            {status}
          </div>
        </main>
      </div>
      <TerminalDrawer
        paneCount={paneCount}
        panes={panes}
        onSelectTab={selectTab}
        onCloseTab={closeSession}
        onMoveToOtherPane={moveSessionToPane}
        onFocusPane={setFocusedPane}
        onExit={() => {}}
        endOnCloseIds={endOnCloseIds}
        collapsed={drawerCollapsed}
        onToggleCollapsed={setDrawerCollapsed}
        height={drawerHeight}
        onResizeHeight={setDrawerHeight}
        rootStatus={rootStatus}
        onNewTerminal={handleNewTerminal}
        onToggleSplit={toggleSplit}
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
