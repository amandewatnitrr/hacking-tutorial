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

function sudoAvailable() {
  if (process.platform === "win32") return false;
  const res = spawnSync("which", ["sudo"]);
  return res.status === 0;
}

const canSudo = !isRoot && sudoAvailable();

function send(ws, payload) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  // Local LAN tool, no cookies/credentials involved — a permissive CORS
  // header just lets the frontend (served from a different port in dev,
  // or a different device on the same network) read the health check.
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, root: isRoot, canSudo }));
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
  let term = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "start") {
      if (term) return;

      const cols = Number(msg.cols) || 80;
      const rows = Number(msg.rows) || 24;
      const wantsSudo = !isRoot && msg.elevate === true && canSudo;

      const file = wantsSudo ? "sudo" : SHELL;
      const args = wantsSudo ? ["-S", "-p", "", SHELL] : [];

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

      term.onData((data) => send(ws, { type: "data", data }));
      term.onExit(({ exitCode }) => {
        send(ws, { type: "exit", exitCode });
        term = null;
      });

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
          if (term) term.write(msg.prefill);
        }, 250);
      }
      return;
    }

    if (msg.type === "input" && term && typeof msg.data === "string") {
      term.write(msg.data);
      return;
    }

    if (msg.type === "resize" && term) {
      const cols = Number(msg.cols);
      const rows = Number(msg.rows);
      if (cols > 0 && rows > 0) term.resize(cols, rows);
      return;
    }
  });

  ws.on("close", () => {
    if (term) {
      term.kill();
      term = null;
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`hack-ui backend listening on ${HOST}:${PORT} (root: ${isRoot}, sudo available: ${canSudo})`);
});
