import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const [command, ...extra] = process.argv.slice(2);
const cli = require.resolve('@playwright/test/cli');
const commands = {
    install: [cli, 'install', 'chromium', ...extra],
    test: [cli, 'test', ...extra],
    record: [path.join(root, 'scripts/record-demo.mjs')],
    perf: [path.join(root, 'scripts/measure-performance.mjs')],
};
if (!commands[command]) throw new Error('Choose install, test, record or perf.');
// Set the browser directory BEFORE importing Playwright in the child process.
const result = spawnSync(process.execPath, commands[command], {
    cwd: root, stdio: 'inherit', env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: path.join(root, '.runtime/browsers') },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
