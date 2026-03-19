// scripts/prepare.js
// Runs husky ONLY when someone is developing cs-setup itself.
// When cs-setup is installed as a dependency (via GitHub or npm),
// INIT_CWD will differ from cwd — we skip husky entirely in that case.

const { execSync } = require('child_process');
const initCwd = process.env.INIT_CWD;
const cwd = process.cwd();

if (initCwd && initCwd !== cwd) {
  console.log('[cs-setup] Installed as dependency — skipping husky prepare.');
  process.exit(0);
}

// Also skip if no .git directory (not a git repo)
const fs = require('fs');
if (!fs.existsSync('.git')) {
  console.log('[cs-setup] No .git directory found — skipping husky prepare.');
  process.exit(0);
}

try {
  execSync('npx husky', { stdio: 'inherit' });
} catch {
  process.exit(0);
}
