const { setupPrePushHook } = require('./lib/ci');
const path = require('path');
const fs = require('fs-extra');

async function test() {
  const dummyGit = path.resolve('./dummy-git');
  await fs.ensureDir(path.join(dummyGit, '.git'));
  await fs.ensureDir(path.join(dummyGit, '.husky'));
  
  console.log('Testing setupPrePushHook in:', dummyGit);
  try {
    // Simulate being in a subdirectory (monorepo)
    const dummyProject = path.join(dummyGit, 'my-sub-project');
    await fs.ensureDir(dummyProject);
    await fs.writeJSON(path.join(dummyProject, 'package.json'), { name: 'sub' });
    
    process.chdir(dummyProject);
    await setupPrePushHook(dummyGit);
    
    const hookPath = path.join(dummyGit, '.husky', 'pre-push');
    if (await fs.pathExists(hookPath)) {
      console.log('SUCCESS: pre-push hook generated.');
      const content = await fs.readFile(hookPath, 'utf8');
      console.log('--- Hook Content ---');
      console.log(content);
      console.log('--- End Hook Content ---');
    } else {
      console.log('FAILURE: hook not generated.');
    }
  } catch (err) {
    console.error('ERROR during setupPrePushHook:', err);
  } finally {
    // cleanup
  }
}

test();
