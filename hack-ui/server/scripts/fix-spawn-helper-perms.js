// node-pty's prebuilt unix helper binary occasionally loses its executable
// bit when npm extracts the package (seen on macOS; harmless to run anywhere
// else). Without +x, every pty.spawn() fails with "posix_spawnp failed."
const fs = require("fs");
const path = require("path");

const prebuildsDir = path.join(__dirname, "..", "node_modules", "node-pty", "prebuilds");

if (!fs.existsSync(prebuildsDir)) process.exit(0);

for (const platformDir of fs.readdirSync(prebuildsDir)) {
  const helper = path.join(prebuildsDir, platformDir, "spawn-helper");
  if (fs.existsSync(helper)) {
    fs.chmodSync(helper, 0o755);
  }
}
