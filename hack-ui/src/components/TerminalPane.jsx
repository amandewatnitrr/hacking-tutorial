import { useEffect, useRef, useState } from "react"
import { TerminalTab } from "./TerminalTab"
import { backendRecordUrl } from "../lib/backend"

export function TerminalPane({
  tabs,
  activeId,
  onSelect,
  onClose,
  onMoveToOtherPane,
  onFocus,
  endOnCloseIds,
  onExit,
}) {
  const terminalsRef = useRef(new Map())
  const searchInputRef = useRef(null)
  const [recordStatus, setRecordStatus] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState({ resultIndex: -1, resultCount: 0 })

  const activeSession = tabs.find((tab) => tab.id === activeId) ?? null

  const handleTerminalReady = (sessionId, api) => {
    if (api) terminalsRef.current.set(sessionId, api)
    else terminalsRef.current.delete(sessionId)
  }

  useEffect(() => {
    const api = terminalsRef.current.get(activeId)
    setSearchResult({ resultIndex: -1, resultCount: 0 })
    if (!api) return
    const disposable = api.onResultsChange?.((result) => setSearchResult(result))
    return () => disposable?.dispose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, searchOpen])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  const closeSearch = () => {
    terminalsRef.current.get(activeId)?.clearSearch()
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResult({ resultIndex: -1, resultCount: 0 })
    terminalsRef.current.get(activeId)?.focus()
  }

  const runSearch = (direction) => {
    const api = terminalsRef.current.get(activeId)
    if (!api || !searchQuery) return
    if (direction === "previous") api.findPrevious(searchQuery)
    else api.findNext(searchQuery)
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      runSearch(event.shiftKey ? "previous" : "next")
    } else if (event.key === "Escape") {
      event.preventDefault()
      closeSearch()
    }
  }

  const handleRecord = async () => {
    const api = terminalsRef.current.get(activeId)
    if (!api) return

    try {
      const res = await fetch(backendRecordUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: api.getText() }),
      })
      const data = await res.json()
      setRecordStatus(res.ok ? `saved terminal-record/${data.file}` : `save failed — ${data.error ?? "unknown error"}`)
    } catch {
      setRecordStatus("save failed — is the backend running?")
    }
    setTimeout(() => setRecordStatus(""), 3200)
  }

  return (
    <div className="terminal-pane" onMouseDown={onFocus}>
      <div className="terminal-pane__bar">
        <div className="terminal-pane__tabs">
          {tabs.map((session) => (
            <button
              type="button"
              key={session.id}
              className={`terminal-tab${session.id === activeId ? " terminal-tab--active" : ""}`}
              onClick={() => onSelect(session.id)}
            >
              <span className="terminal-tab__dot" aria-hidden="true" />
              {session.title}
              {onMoveToOtherPane && (
                <span
                  className="terminal-tab__move"
                  role="button"
                  aria-label={`Move ${session.title} to the other pane`}
                  title="Move to the other pane"
                  onClick={(event) => {
                    event.stopPropagation()
                    onMoveToOtherPane(session.id)
                  }}
                >
                  ⇄
                </span>
              )}
              <span
                className="terminal-tab__close"
                role="button"
                aria-label={`Close ${session.title}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onClose(session.id)
                }}
              >
                &times;
              </span>
            </button>
          ))}
        </div>
        {recordStatus && <div className="terminal-pane__status mono">{recordStatus}</div>}
        <button
          type="button"
          className={`terminal-drawer__search-toggle${searchOpen ? " terminal-drawer__search-toggle--active" : ""}`}
          onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          disabled={!activeId}
          aria-label={searchOpen ? "Close scrollback search" : "Search terminal output"}
          title="Search this terminal's scrollback"
        >
          ⌕ find
        </button>
        <button
          type="button"
          className="terminal-drawer__record"
          onClick={handleRecord}
          disabled={!activeId}
          aria-label="Save current terminal output to a log file"
          title="Save current terminal output to terminal-record/"
        >
          ● record
        </button>
      </div>
      <div
        className={`terminal-drawer__search-bar${searchOpen ? " terminal-drawer__search-bar--open" : ""}`}
      >
        <div className="terminal-drawer__search-bar-inner">
          <input
            ref={searchInputRef}
            type="text"
            className="terminal-drawer__search-input"
            placeholder="search scrollback…"
            aria-label="Search terminal scrollback"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            tabIndex={searchOpen ? 0 : -1}
          />
          <span className="terminal-drawer__search-count mono">
            {searchQuery
              ? searchResult.resultCount
                ? `${searchResult.resultIndex + 1}/${searchResult.resultCount}`
                : "0/0"
              : ""}
          </span>
          <button
            type="button"
            className="terminal-drawer__search-nav"
            onClick={() => runSearch("previous")}
            disabled={!searchQuery}
            aria-label="Previous match"
            tabIndex={searchOpen ? 0 : -1}
          >
            ↑
          </button>
          <button
            type="button"
            className="terminal-drawer__search-nav"
            onClick={() => runSearch("next")}
            disabled={!searchQuery}
            aria-label="Next match"
            tabIndex={searchOpen ? 0 : -1}
          >
            ↓
          </button>
          <button
            type="button"
            className="terminal-drawer__search-close"
            onClick={closeSearch}
            aria-label="Close search"
            tabIndex={searchOpen ? 0 : -1}
          >
            &times;
          </button>
        </div>
      </div>
      <div className="terminal-pane__body">
        {activeSession ? (
          <TerminalTab
            key={activeSession.id}
            session={activeSession}
            onExit={onExit}
            onReady={handleTerminalReady}
            endOnCloseIds={endOnCloseIds}
          />
        ) : (
          <div className="terminal-pane__empty mono">
            {tabs.length === 0 ? "no terminal here" : "select a tab"}
          </div>
        )}
      </div>
    </div>
  )
}
