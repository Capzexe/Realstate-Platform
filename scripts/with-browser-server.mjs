import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.join(root, '.runtime/browsers');

export async function withBrowserServer(callback) {
    const port = Number(process.env.BROWSER_TEST_PORT || 3101);
    const baseURL = `http://127.0.0.1:${port}`;
    let occupied = false;
    try { occupied = (await fetch(`${baseURL}/up`, { signal: AbortSignal.timeout(1000) })).ok; } catch { /* No existing local server. */ }
    if (occupied) throw new Error(`Port ${port} is already in use; refusing to reuse another server.`);
    const server = spawn(process.execPath, ['scripts/browser-server.mjs'], { cwd: root, stdio: 'ignore', env: { ...process.env, BROWSER_TEST_PORT: String(port) } });
    try {
        let ready = false;
        for (let attempt = 0; attempt < 300; attempt++) {
            if (server.exitCode !== null) throw new Error('The isolated server stopped before it was ready.');
            try { ready = (await fetch(`${baseURL}/up`)).ok; } catch { /* Wait for migrations and the socket. */ }
            if (ready) break;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        if (!ready) throw new Error('The isolated server did not start in time.');
        return await callback(baseURL);
    } finally {
        // Stop only our own process tree; never the developer's app on port 3000.
        if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
        else server.kill('SIGTERM');
    }
}
