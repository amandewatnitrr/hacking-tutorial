# hack-ui backend

Tiny Node server that gives the UI a real shell: each open terminal tab is one
`node-pty` process, streamed to the browser over a WebSocket at `/pty`.
`GET /api/health` reports whether the server itself is running as root.

## Root access, without a password popup per click

Kali's normal root terminal asks for a password every time because *you*
launch a fresh privileged process every time. This server sidesteps that by
having **the backend itself run as root once** (as a systemd service) —
every shell it then spawns for a terminal tab inherits that root, so no
`sudo` prompt ever shows up in the UI.

### Recommended: run the backend as a root systemd service

```bash
sudo mkdir -p /opt/hack-ui
sudo cp -r server /opt/hack-ui/server
cd /opt/hack-ui/server && sudo npm install   # builds node-pty's native addon for this machine
sudo cp hack-ui-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hack-ui-server
```

You'll be asked for your password exactly once here, to install the service.
After that, the service starts as root on every boot and no terminal tile in
the UI ever prompts again.

### Alternative: run it as your own user

`npm start` from this folder runs the backend as whatever user started it.
Every terminal tab then opens as that user, not root. The UI's "ask for root
password" toggle covers this case: turning it on pops up a password field
before a tab opens, and that password is sent once (over the local WebSocket
only, never written to disk or logged) to answer `sudo`'s own prompt inside
that tab — same thing you'd type by hand, just typed for you.

With the toggle off and the backend not root, tabs open as a normal user and
print a one-line banner saying so, instead of silently pretending to be root.

## Dev (this Mac, no Kali, no real root target)

```bash
cd server
npm install
npm start
```

Opens on `:7117` as your normal Mac user — enough to exercise the terminal
UI (open tab, type, resize, close) without a Pi. The "running as $(whoami)"
banner is expected here.
