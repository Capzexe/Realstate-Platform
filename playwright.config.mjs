import { defineConfig, devices } from '@playwright/test';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '.runtime/browsers';
export default defineConfig({
    testDir: './tests/Browser',
    fullyParallel: false,
    workers: 1,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    timeout: 120000,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:3100',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
    ],
    webServer: {
        command: 'node scripts/browser-server.mjs',
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: false,
        timeout: 90000,
    },
});
