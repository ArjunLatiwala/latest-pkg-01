const { setupCIScript } = require('./lib/ci');
const path = require('path');
const fs = require('fs-extra');

async function test() {
  const dummyProject = path.resolve('./dummy-project');
  await fs.ensureDir(dummyProject);
  console.log('Testing setupCIScript in:', dummyProject);
  try {
    await setupCIScript(dummyProject);
    const scriptPath = path.join(dummyProject, 'scripts', 'run-ci-checks.sh');
    if (await fs.pathExists(scriptPath)) {
      console.log('SUCCESS: script generated.');
    } else {
      console.log('FAILURE: script not generated.');
    }
  } catch (err) {
    console.error('ERROR during setupCIScript:', err);
  } finally {
    // await fs.remove(dummyProject);
  }
}

test();
