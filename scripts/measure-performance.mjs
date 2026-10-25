import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { root, withBrowserServer } from './with-browser-server.mjs';

await withBrowserServer(async baseURL => {
    const browser = await chromium.launch({ args: ['--remote-debugging-port=9223', '--remote-debugging-address=127.0.0.1'] });
    try {
        const directory = path.join(root, 'artifacts/performance');
        mkdirSync(directory, { recursive: true });
        const pages = [];
        for (const [name, route] of [['home', '/'], ['pricing', '/cenas']]) {
            const result = await lighthouse(baseURL + route, { port: 9223, output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' });
            writeFileSync(path.join(directory, `${name}.html`), result.report[0]);
            writeFileSync(path.join(directory, `${name}.json`), result.report[1]);
            const { lhr } = result;
            pages.push({ page: name, url: lhr.finalDisplayedUrl, fetchedAt: lhr.fetchTime,
                scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])),
                metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift'].map(key => [key, { value: lhr.audits[key].numericValue, display: lhr.audits[key].displayValue }])),
                warnings: lhr.runWarnings,
            });
        }
        const summary = { environment: 'One local PHP development-server run per page, Lighthouse mobile simulation. Not Hostinger or field Core Web Vitals.', pages };
        writeFileSync(path.join(directory, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
        console.log(JSON.stringify(summary, null, 2));
    } finally { await browser.close(); }
});
