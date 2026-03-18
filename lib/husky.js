'use strict';

const fs = require('fs-extra');
const { readJSON, writeJSON } = require('./utils');
const { installDevDependency } = require('./packageManager');
const execa = require('execa');
const path = require('path');
const { logInfo, logSuccess } = require('./logger');

/**
 * installHusky(gitRoot)
 *
 * gitRoot – directory containing .git
 *           Husky MUST be initialised here so hooks land in gitRoot/.husky/
 *           In a monorepo this differs from process.cwd() (the project root).
 */
exports.installHusky = async (gitRoot, projectRoot) => {
  const targetProject = projectRoot || process.cwd();
  const pkgPath = path.join(targetProject, 'package.json');

  if (!await fs.pathExists(pkgPath)) {
    logInfo(`No package.json found at ${targetProject} — skipping Husky install.`);
    return;
  }

  const pkg = await readJSON(pkgPath);

  // Install husky if not already in devDependencies / node_modules
  // Always install/update husky in devDependencies
  await installDevDependency('husky', targetProject);

  // Always run husky init from the git root so .husky/ is created there
  logInfo(`Initializing Husky in git root: ${gitRoot || targetProject}`);
  const opts = { stdio: 'inherit', cwd: gitRoot || targetProject };

  try {
    await execa('npx', ['husky'], opts);              // husky v9+
  } catch {
    try {
      await execa('npx', ['husky', 'install'], opts); // husky v8 fallback
    } catch {
      logInfo("Husky init skipped — will run on next `npm install`.");
    }
  }

  // Ensure "prepare": "husky || true" is set (overwrite existing if different)
  if (!pkg.scripts) pkg.scripts = {};
  if (pkg.scripts.prepare !== 'husky || true') {
    pkg.scripts.prepare = 'husky || true';
    await writeJSON(pkgPath, pkg);
    logSuccess('Ensured "prepare": "husky || true" script in package.json.');
  }
};