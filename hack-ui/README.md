# hack-ui

A browser UI with real terminal tabs, backed by a local Node PTY bridge. The
frontend is a Vite + React app; the backend (`server/`) spawns actual shells
and streams them to the browser over a WebSocket on `:7117`.

## Quick start (one command)

```bash
npm run install:all   # installs frontend + backend deps
npm run dev:all        # runs backend (:7117) and frontend (:5183) together
```

Open http://localhost:5183.

`dev:all` uses `concurrently` to run both processes in one terminal, each
log line prefixed `backend` or `frontend`. Stop both with `Ctrl+C`.

## Manual / two-terminal setup

If you'd rather run each piece on its own (useful for reading backend logs
separately, or when setting up the backend as a root systemd service — see
[server/README.md](server/README.md)):

**Terminal 1 — backend**
```bash
cd server
npm install
npm start
```
Runs on `:7117` as whatever user started it.

**Terminal 2 — frontend**
```bash
npm install
npm run dev -- --port 5183
```

## Root shells in the terminal tabs

By default the backend runs as your normal user, so terminal tabs in the UI
open as that user. For real root shells without a `sudo` prompt per tab
(e.g. running this on Kali against a target), see the systemd service setup
in [server/README.md](server/README.md).

## Scripts

| Command | Does |
| --- | --- |
| `npm run install:all` | Install frontend deps, then backend deps (`server/`) |
| `npm run dev:all` | Run backend + frontend together |
| `npm run dev` | Frontend only (Vite dev server) |
| `npm run dev:server` | Backend only (PTY bridge on `:7117`) |
| `npm run build` | Production frontend build |
| `npm run lint` | Oxlint |
