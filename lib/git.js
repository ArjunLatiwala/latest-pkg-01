const fs = require('fs');
const path = require('path');

// Walks up directory tree to find both .git folder and package.json folder
// Returns { found, gitRoot, projectRoot }
// gitRoot    = where .git is (where husky installs hooks)
// projectRoot = where package.json is (where scripts/sonar/tools live)
exports.isGitRepo = async () => {
  const startDir = process.cwd();
  let dir = startDir;
  let gitRoot = null;
  let projectRoot = null;

  while (true) {
    if (!gitRoot && fs.existsSync(path.join(dir, '.git'))) {
      gitRoot = dir;
    }
    if (!projectRoot && fs.existsSync(path.join(dir, 'package.json'))) {
      projectRoot = dir;
    }

    if (gitRoot && projectRoot) break;

    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  // If no package.json found anywhere, we cannot proceed as a Node project
  if (!projectRoot) {
    return { found: false, error: 'No package.json found in this directory or any parent.' };
  }

  // If no .git found, it's not a git repo (but we found the project root)
  if (!gitRoot) {
    return { found: false, error: 'Not a git repository (no .git found).', projectRoot };
  }

  return { found: true, gitRoot, projectRoot };
};