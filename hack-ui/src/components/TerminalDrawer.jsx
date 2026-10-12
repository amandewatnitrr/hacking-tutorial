import { useRef } from "react"
import { TerminalTab } from "./TerminalTab"

const MIN_HEIGHT = 180
const MAX_HEIGHT_MARGIN = 160

export function TerminalDrawer({
  sessions,
  activeId,
  onSelect,
  onClose,
  collapsed,
  onToggleCollapsed,
  height,
  onResizeHeight,
  rootStatus,
}) {
  const dragRef = useRef(null)

  const startDrag = (event) => {
    dragRef.current = { startY: event.clientY, startHeight: height }
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
    window.removeEventListener("mousemove", handleDrag)
    window.removeEventListener("mouseup", stopDrag)
  }

  if (sessions.length === 0) return null

  return (
    <div className="terminal-drawer" style={{ height: collapsed ? 40 : height }}>
      {!collapsed && (
        <div className="terminal-drawer__handle" onMouseDown={startDrag} />
      )}
      <div className="terminal-drawer__bar">
        <div className="terminal-drawer__tabs">
          {sessions.map((session) => (
            <button
              type="button"
              key={session.id}
              className={`terminal-tab${session.id === activeId && !collapsed ? " terminal-tab--active" : ""}`}
              onClick={() => {
                onSelect(session.id)
                if (collapsed) onToggleCollapsed(false)
              }}
            >
              <span className="terminal-tab__dot" aria-hidden="true" />
              {session.title}
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
        <div className="terminal-drawer__status mono">{rootStatus}</div>
        <button
          type="button"
          className="terminal-drawer__collapse"
          onClick={() => onToggleCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand terminal" : "Collapse terminal"}
        >
          {collapsed ? "⌃" : "⌄"}
        </button>
      </div>
      <div className="terminal-drawer__body" style={{ display: collapsed ? "none" : "block" }}>
        {sessions.map((session) => (
          <TerminalTab key={session.id} session={session} active={session.id === activeId} onExit={() => {}} />
        ))}
      </div>
    </div>
  )
}
