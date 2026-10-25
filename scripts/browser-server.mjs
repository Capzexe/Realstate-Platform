import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, openSync, closeSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localPhp = path.join(root, '.runtime/php-8.4.27/php.exe');
const php = process.env.PHP_BINARY || (existsSync(localPhp) ? localPhp : 'php');
const parent = path.join(root, '.runtime/browser');
mkdirSync(parent, { recursive: true });
const directory = mkdtempSync(path.join(parent, 'run-'));
const storage = path.join(directory, 'storage');
for (const folder of ['logs', 'framework/cache/data', 'framework/sessions', 'framework/views']) {
    mkdirSync(path.join(storage, folder), { recursive: true });
}
const database = path.join(directory, 'database.sqlite');
writeFileSync(database, '');

// This server never reads or resets the developer's SQLite database. CSRF stays
// active because the browser uses local mode rather than Laravel's testing bypass.
const port = Number(process.env.BROWSER_TEST_PORT || 3100);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid browser test port.');
const env = {
    ...process.env,
    APP_ENV: 'local', APP_DEBUG: 'false', APP_URL: `http://127.0.0.1:${port}`,
    APP_KEY: `base64:${randomBytes(32).toString('base64')}`,
    APP_CONFIG_CACHE: path.join(directory, 'config.php'),
    APP_ROUTES_CACHE: path.join(directory, 'routes.php'),
    APP_LOCALE: 'lv', APP_FALLBACK_LOCALE: 'en',
    DB_CONNECTION: 'sqlite', DB_DATABASE: database,
    LARAVEL_STORAGE_PATH: storage, VIEW_COMPILED_PATH: path.join(storage, 'framework/views'),
    SESSION_DRIVER: 'file', CACHE_STORE: 'file', LOG_CHANNEL: 'single',
    DEMO_PAYMENTS: 'true', MAIL_MAILER: 'log',
    STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '',
};
const prepared = spawnSync(php, ['artisan', 'migrate', '--seed', '--force', '--no-interaction'], { cwd: root, env, stdio: 'inherit' });
if (prepared.status !== 0) process.exit(prepared.status || 1);
const router = path.join(root, 'vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php');
const log = openSync(path.join(directory, 'server.log'), 'a');
const server = spawn(php, ['-S', `127.0.0.1:${port}`, router], { cwd: path.join(root, 'public'), env, stdio: ['ignore', log, log] });
closeSync(log);
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.on('exit', code => process.exit(code || 0));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill());
