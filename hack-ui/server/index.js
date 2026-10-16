const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { WebSocketServer } = require("ws");
const pty = require("node-pty");
const { spawnSync } = require("child_process");

const PORT = Number(process.env.HACKUI_SERVER_PORT) || 7117;
const HOST = process.env.HACKUI_SERVER_HOST || "0.0.0.0";
const SHELL = process.platform === "win32" ? "powershell.exe" : process.env.SHELL || "bash";
const isRoot = typeof process.getuid === "function" && process.getuid() === 0;
const RECORD_DIR = path.join(__dirname, "..", "terminal-record");
const MAX_RECORD_BODY = 10 * 1024 * 1024; // 10MB of scrollback text is already a lot

// A PTY outlives its WebSocket now (browser refresh, tab switch, pane move
// all just detach) so it needs its own cleanup: how much output we keep
// around to repaint a reattaching client, and how long an unattended PTY
// (nobody watching, e.g. a tab closed by refresh rather than the × button)
// is allowed to keep running before we kill it.
const MAX_BUFFER = 500_000;
const IDLE_KILL_MS = Number(process.env.HACKUI_SESSION_IDLE_MS) || 20 * 60 * 1000;

function sudoAvailable() {
  if (process.platform === "win32") return false;
  const res = spawnSync("which", ["sudo"]);
  return res.status === 0;
}

const canSudo = !isRoot && sudoAvailable();

function send(ws, payload) {
  if (ws && ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

// id -> { id, title, elevate, createdAt, term, buffer, ws, idleTimer }
const sessions = new Map();

function killSession(session) {
  if (session.idleTimer) clearTimeout(session.idleTimer);
  session.idleTimer = null;
  try {
    session.term.kill();
  } catch {
    // already dead
  }
}

function armIdleTimer(session) {
  if (session.idleTimer) clearTimeout(session.idleTimer);
  session.idleTimer = setTimeout(() => killSession(session), IDLE_KILL_MS);
}

const server = http.createServer((req, res) => {
  // Local LAN tool, no cookies/credentials involved — a permissive CORS
  // header just lets the frontend (served from a different port in dev,
  // or a different device on the same network) read these endpoints.
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, root: isRoot, canSudo }));
    return;
  }

  if (req.method === "GET" && req.url === "/api/sessions") {
    const list = [...sessions.values()].map((s) => ({
      id: s.id,
      title: s.title,
      elevate: s.elevate,
      createdAt: s.createdAt,
      attached: s.ws != null,
    }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, sessions: list }));
    return;
  }

  if (req.method === "OPTIONS" && req.url === "/api/record") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/record") {
    const chunks = [];
    let size = 0;
    let aborted = false;

    req.on("data", (chunk) => {
      if (aborted) return;
      size += chunk.length;
      if (size > MAX_RECORD_BODY) {
        aborted = true;
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "recording too large" }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (aborted) return;
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "invalid JSON body" }));
        return;
      }

      if (typeof body.content !== "string") {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "missing content string" }));
        return;
      }

      const ext = body.ext === "log" ? "log" : "txt";
      const file = `${crypto.randomBytes(8).toString("hex")}.${ext}`;

      try {
        fs.mkdirSync(RECORD_DIR, { recursive: true });
        fs.writeFileSync(path.join(RECORD_DIR, file), body.content, "utf8");
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: err.message }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, file }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "not found" }));
});

const wss = new WebSocketServer({ server, path: "/pty" });

wss.on("connection", (ws) => {
  // Which session this socket currently speaks for — set once on "start",
  // used by "input"/"resize"/"end" and by the close handler below.
  let boundSessionId = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "start") {
      if (boundSessionId) return;

      const cols = Number(msg.cols) || 80;
      const rows = Number(msg.rows) || 24;
      const id = typeof msg.sessionId === "string" && msg.sessionId ? msg.sessionId : crypto.randomUUID();

      const existing = sessions.get(id);
      if (existing) {
        // Reattach: the PTY kept running while this client was away
        // (refresh, tab switch, pane move) — hand it the new socket and
        // replay what it missed instead of spawning a second shell.
        if (existing.ws && existing.ws !== ws) {
          send(existing.ws, {
            type: "data",
            data: "\r\n\x1b[90m[hack-ui] session reattached from another tab]\x1b[0m\r\n",
          });
          existing.ws.close();
        }
        existing.ws = ws;
        boundSessionId = id;
        if (existing.idleTimer) {
          clearTimeout(existing.idleTimer);
          existing.idleTimer = null;
        }
        try {
          existing.term.resize(cols, rows);
        } catch {
          // PTY already gone — the "exit" frame already told the client
        }
        send(ws, { type: "attached", id, title: existing.title, elevate: existing.elevate });
        if (existing.buffer) send(ws, { type: "data", data: existing.buffer });
        return;
      }

      const wantsSudo = !isRoot && msg.elevate === true && canSudo;
      const file = wantsSudo ? "sudo" : SHELL;
      const args = wantsSudo ? ["-S", "-p", "", SHELL] : [];

      let term;
      try {
        term = pty.spawn(file, args, {
          name: "xterm-256color",
          cols,
          rows,
          cwd: process.env.HOME || process.cwd(),
          env: process.env,
        });
      } catch (err) {
        send(ws, { type: "data", data: `\r\n[hack-ui] failed to start shell: ${err.message}\r\n` });
        send(ws, { type: "exit", exitCode: 1 });
        return;
      }

      const session = {
        id,
        title: typeof msg.title === "string" && msg.title ? msg.title : "terminal",
        elevate: wantsSudo,
        createdAt: Date.now(),
        term,
        buffer: "",
        ws,
        idleTimer: null,
      };
      sessions.set(id, session);
      boundSessionId = id;

      term.onData((data) => {
        session.buffer += data;
        if (session.buffer.length > MAX_BUFFER) session.buffer = session.buffer.slice(-MAX_BUFFER);
        send(session.ws, { type: "data", data });
      });

      term.onExit(({ exitCode }) => {
        send(session.ws, { type: "exit", exitCode });
        if (session.idleTimer) clearTimeout(session.idleTimer);
        sessions.delete(id);
      });

      send(ws, { type: "attached", id, title: session.title, elevate: session.elevate });

      if (wantsSudo && typeof msg.password === "string" && msg.password.length > 0) {
        term.write(msg.password + "\n");
      }

      if (!isRoot && !wantsSudo) {
        term.write(
          'echo "[hack-ui] running as $(whoami) — enable the hack-ui-server systemd service to run as root with no password prompt, or turn on \\"ask for root password\\" in the UI"\r'
        );
      }

      if (typeof msg.prefill === "string" && msg.prefill.length > 0) {
        // small delay so the shell's own startup/profile output settles
        // before we type into the prompt — otherwise the prefill can land
        // mid banner instead of at the live cursor.
        setTimeout(() => {
          if (sessions.has(id)) term.write(msg.prefill);
        }, 250);
      }
      return;
    }

    const session = boundSessionId ? sessions.get(boundSessionId) : null;
    if (!session) return;

    if (msg.type === "input" && typeof msg.data === "string") {
      session.term.write(msg.data);
      return;
    }

    if (msg.type === "resize") {
      const cols = Number(msg.cols);
      const rows = Number(msg.rows);
      if (cols > 0 && rows > 0) session.term.resize(cols, rows);
      return;
    }

    if (msg.type === "end") {
      // Explicit close (the tab's × button) — unlike a plain disconnect,
      // this kills the PTY immediately instead of granting it a grace period.
      killSession(session);
      return;
    }
  });

  ws.on("close", () => {
    if (!boundSessionId) return;
    const session = sessions.get(boundSessionId);
    if (!session || session.ws !== ws) return;
    session.ws = null;
    armIdleTimer(session);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`hack-ui backend listening on ${HOST}:${PORT} (root: ${isRoot}, sudo available: ${canSudo})`);
});
