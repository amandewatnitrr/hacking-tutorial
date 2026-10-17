import { useRef, useState } from "react"
import { TerminalPane } from "./TerminalPane"

const MIN_HEIGHT = 180
const MAX_HEIGHT_MARGIN = 160
const MIN_PANE_PERCENT = 25
const MAX_PANE_PERCENT = 75

export function TerminalDrawer({
  paneCount,
  panes,
  onSelectTab,
  onCloseTab,
  onMoveToOtherPane,
  onFocusPane,
  onExit,
  endOnCloseIds,
  collapsed,
  onToggleCollapsed,
  height,
  onResizeHeight,
  rootStatus,
  onNewTerminal,
  onToggleSplit,
}) {
  const dragRef = useRef(null)
  const splitDragRef = useRef(null)
  const panesRowRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [paneSplit, setPaneSplit] = useState(50)

  const hasAnySession = panes.A.tabs.length > 0 || panes.B.tabs.length > 0
  if (!hasAnySession) return null

  const startDrag = (event) => {
    dragRef.current = { startY: event.clientY, startHeight: height }
    setIsDragging(true)
    window.addEventListener("mousemove", handleDrag)
    window.addEventListener("mouseup", stopDrag)
  }

  const handleDrag = (event) => {
    if (!dragRef.current) return
    const delta = dragRef.current.startY - event.clientY
    const maxHeight = window.innerHeight - MAX_HEIGHT_MARGIN
    const next = Math.min(maxHeight, Math.max(MIN_HEIGHT, dragRef.current.startHeight + delta))
    onResizeHeight(next)
  }

  const stopDrag = () => {
    dragRef.current = null
    setIsDragging(false)
    window.removeEventListener("mousemove", handleDrag)
    window.removeEventListener("mouseup", stopDrag)
  }

  const startSplitDrag = (event) => {
    splitDragRef.current = { startX: event.clientX, startSplit: paneSplit }
    window.addEventListener("mousemove", handleSplitDrag)
    window.addEventListener("mouseup", stopSplitDrag)
  }

  const handleSplitDrag = (event) => {
    if (!splitDragRef.current || !panesRowRef.current) return
    const { width } = panesRowRef.current.getBoundingClientRect()
    const delta = ((event.clientX - splitDragRef.current.startX) / width) * 100
    const next = Math.min(MAX_PANE_PERCENT, Math.max(MIN_PANE_PERCENT, splitDragRef.current.startSplit + delta))
    setPaneSplit(next)
  }

  const stopSplitDrag = () => {
    splitDragRef.current = null
    window.removeEventListener("mousemove", handleSplitDrag)
    window.removeEventListener("mouseup", stopSplitDrag)
  }

  return (
    <div
      className={`terminal-drawer${isDragging ? " terminal-drawer--dragging" : ""}`}
      style={{ height: collapsed ? 40 : height }}
    >
      {!collapsed && <div className="terminal-drawer__handle" onMouseDown={startDrag} />}
      <div className="terminal-drawer__toolbar">
        <span className="terminal-drawer__status mono">{rootStatus}</span>
        <button type="button" className="terminal-drawer__new" onClick={onNewTerminal}>
          + terminal
        </button>
        <button type="button" className="terminal-drawer__split" onClick={onToggleSplit}>
          {paneCount === 2 ? "⊟ merge panes" : "⊞ split view"}
        </button>
        <button
          type="button"
          className="terminal-drawer__collapse"
          onClick={() => onToggleCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand terminal" : "Collapse terminal"}
        >
          {collapsed ? "⌃" : "⌄"}
        </button>
      </div>
      {!collapsed && (
        <div className="terminal-drawer__panes" ref={panesRowRef}>
          <div className="terminal-drawer__pane-slot" style={{ flex: paneCount === 2 ? `0 0 ${paneSplit}%` : "1 1 auto" }}>
            <TerminalPane
              tabs={panes.A.tabs}
              activeId={panes.A.activeId}
              onSelect={(id) => onSelectTab("A", id)}
              onClose={(id) => onCloseTab(id)}
              onMoveToOtherPane={paneCount === 2 ? (id) => onMoveToOtherPane(id, "B") : undefined}
              onFocus={() => onFocusPane("A")}
              endOnCloseIds={endOnCloseIds}
              onExit={onExit}
            />
          </div>
          {paneCount === 2 && (
            <>
              <div className="terminal-drawer__pane-divider" onMouseDown={startSplitDrag} />
              <div className="terminal-drawer__pane-slot" style={{ flex: `1 1 auto` }}>
                <TerminalPane
                  tabs={panes.B.tabs}
                  activeId={panes.B.activeId}
                  onSelect={(id) => onSelectTab("B", id)}
                  onClose={(id) => onCloseTab(id)}
                  onMoveToOtherPane={(id) => onMoveToOtherPane(id, "A")}
                  onFocus={() => onFocusPane("B")}
                  endOnCloseIds={endOnCloseIds}
                  onExit={onExit}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
