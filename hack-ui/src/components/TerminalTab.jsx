import { useEffect, useRef } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { SearchAddon } from "@xterm/addon-search"
import "@xterm/xterm/css/xterm.css"
import { backendWsUrl } from "../lib/backend"

// xterm needs resolved color strings, not CSS var() references, so the fixed
// --term-* tokens (see index.css) are read once at mount. The ANSI 16-color
// entries below are ordinary terminal convention, not app design tokens.
function readTerminalTheme() {
  const style = getComputedStyle(document.documentElement)
  const token = (name) => style.getPropertyValue(name).trim()
  return {
    background: token("--term-bg"),
    foreground: token("--term-ink"),
    cursor: token("--term-stamp"),
    selectionBackground: token("--term-border"),
    black: token("--term-bg"),
    red: "#fb7185",
    green: token("--term-live"),
    yellow: "#fbbf24",
    blue: "#38bdf8",
    magenta: "#a78bfa",
    cyan: "#5eead4",
    white: token("--term-ink"),
  }
}

function dumpBuffer(term) {
  const buffer = term.buffer.active
  const lines = []
  for (let i = 0; i < buffer.length; i++) {
    lines.push(buffer.getLine(i)?.translateToString(true) ?? "")
  }
  return lines.join("\n")
}

// Only the pane's currently-active session is ever mounted — switching tabs,
// moving a session to the other pane, or refreshing the page all unmount
// this component. The backend keeps the PTY (and its output) running
// regardless, so mounting again just reattaches via session.id and replays
// what was missed instead of starting a fresh shell. `endOnCloseIds` is the
// one case that should NOT reattach-on-return: an explicit × click.
export function TerminalTab({ session, onExit, onReady, endOnCloseIds }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const term = new Terminal({
      theme: readTerminalTheme(),
      fontFamily: "var(--font-term)",
      fontSize: 13,
      cursorBlink: true,
      scrollback: 4000,
      allowProposedApi: true,
    })
    const fitAddon = new FitAddon()
    const searchAddon = new SearchAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(searchAddon)
    term.open(containerRef.current)
    fitAddon.fit()
    term.focus()

    const searchDecorations = {
      matchBackground: "#854d0e",
      matchBorder: "#fbbf24",
      matchOverviewRuler: "#fbbf24",
      activeMatchBackground: "#b45309",
      activeMatchBorder: "#fde68a",
      activeMatchColorOverviewRuler: "#fde68a",
    }

    onReady?.(session.id, {
      getText: () => dumpBuffer(term),
      findNext: (query, options) =>
        searchAddon.findNext(query, { decorations: searchDecorations, ...options }),
      findPrevious: (query, options) =>
        searchAddon.findPrevious(query, { decorations: searchDecorations, ...options }),
      clearSearch: () => searchAddon.clearDecorations(),
      onResultsChange: (callback) => searchAddon.onDidChangeResults(callback),
      focus: () => term.focus(),
    })

    const syncSize = () => {
      if (!containerRef.current) return
      fitAddon.fit()
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }))
      }
    }

    // The nerd-font glyphs (icons) change the font's measured cell width —
    // re-fit once it's actually loaded, or icon columns stay sized to the
    // fallback font that painted the first frame.
    document.fonts.load('13px "Hack Nerd Font Mono"').then(syncSize).catch(() => {})

    const ws = new WebSocket(backendWsUrl())

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "start",
          sessionId: session.id,
          title: session.title,
          cols: term.cols,
          rows: term.rows,
          prefill: session.prefill,
          elevate: session.elevate,
          password: session.password,
        })
      )
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === "data") {
          term.write(msg.data)
        } else if (msg.type === "exit") {
          term.write(`\r\n\x1b[90m[process exited${msg.exitCode != null ? ` · code ${msg.exitCode}` : ""}]\x1b[0m\r\n`)
          onExit?.(session.id)
        }
      } catch {
        // ignore malformed frame
      }
    }

    ws.onerror = () => {
      term.write("\r\n\x1b[31m[connection error — is the hack-ui backend running on :7117?]\x1b[0m\r\n")
    }

    const dataListener = term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }))
      }
    })

    const resizeObserver = new ResizeObserver(syncSize)
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      dataListener.dispose()
      if (endOnCloseIds?.current?.has(session.id)) {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "end" }))
        endOnCloseIds.current.delete(session.id)
      }
      ws.onmessage = null
      ws.onerror = null
      ws.close()
      term.dispose()
      onReady?.(session.id, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="terminal-tab-surface" ref={containerRef} />
}
