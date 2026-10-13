import { useEffect, useRef } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
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

export function TerminalTab({ session, active, onExit, onReady }) {
  const containerRef = useRef(null)
  const termRef = useRef(null)
  const wsRef = useRef(null)
  const fitRef = useRef(null)

  useEffect(() => {
    const term = new Terminal({
      theme: readTerminalTheme(),
      fontFamily: "var(--font-term)",
      fontSize: 13,
      cursorBlink: true,
      scrollback: 4000,
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(containerRef.current)
    fitAddon.fit()
    termRef.current = term
    fitRef.current = fitAddon
    onReady?.(session.id, { getText: () => dumpBuffer(term) })

    const syncSize = () => {
      if (!containerRef.current) return
      fitAddon.fit()
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }))
      }
    }

    // The nerd-font glyphs (icons) change the font's measured cell width —
    // re-fit once it's actually loaded, or icon columns stay sized to the
    // fallback font that painted the first frame.
    document.fonts.load('13px "Hack Nerd Font Mono"').then(syncSize).catch(() => {})

    const ws = new WebSocket(backendWsUrl())
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "start",
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

    ws.onclose = () => {
      term.write("\r\n\x1b[90m[connection closed]\x1b[0m\r\n")
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
      ws.close()
      term.dispose()
      onReady?.(session.id, null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (active && fitRef.current && containerRef.current) {
      fitRef.current.fit()
      termRef.current?.focus()
    }
  }, [active])

  return <div className="terminal-tab-surface" style={{ display: active ? "block" : "none" }} ref={containerRef} />
}
