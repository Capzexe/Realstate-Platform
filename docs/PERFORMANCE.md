# Measured local performance

Measured **25 October 2026**, using Lighthouse 13.5.0, Playwright Chromium 156 and project-local PHP 8.4.27 on Windows. Each page received one mobile-simulated Lighthouse run against an isolated PHP development server and fictional SQLite fixtures. The video recorder and browser test run had finished before measurement. These are local lab results, not Hostinger measurements or field Core Web Vitals.

| Metric | Homepage | Pricing |
| --- | ---: | ---: |
| Performance score | 70 | 72 |
| Accessibility automated score | 100 | 100 |
| Best practices score | 100 | 100 |
| SEO automated score | 100 | 100 |
| First Contentful Paint | 1.2 s | 2.9 s |
| Largest Contentful Paint | 1.8 s | 6.8 s |
| Speed Index | 5.0 s | 2.9 s |
| Total Blocking Time | 1,370 ms | 0 ms |
| Cumulative Layout Shift | 0 | 0 |

Raw summary: [2026-10-25.json](performance/2026-10-25.json). Full HTML/JSON reports are generated in ignored `artifacts/performance/` and saved with the CI artifacts. An automated accessibility score is not a WCAG conformance certificate; keyboard and assistive-technology checks remain necessary.

## Reproduce

```sh
npm ci
npm run browser:install
npm run perf
```

The runner creates an isolated temporary database/storage and binds its own localhost server, separate from the application on port 3000. It refuses to reuse an existing measurement server. The process and Chrome are stopped when the run finishes. On Windows the project PHP runtime is selected automatically; otherwise use PHP 8.4+ on PATH or set `PHP_BINARY`.

CI records these measurements without a brittle score threshold: hardware, cold caches and simulated throttling affect scores. The PHP development server is not the deployment web stack.

## What to improve after hosting

The pricing page's LCP is the clearest measured bottleneck. Inspect the image-delivery and rendering details in the HTML report, then evaluate responsive WebP/AVIF variants, proper cache/compression settings and a smaller hero payload. The current interior JPEG is approximately 763 KiB. The homepage's blocking-time result also needs a repeat on the deployed environment before attributing it to a particular script or changing the UI.

After HTTPS deployment, run Lighthouse on the real public URL several times under consistent conditions, compare the median rather than the best run, and record the environment. Do not present these localhost values as production speed or claim an improvement percentage without a new comparable measurement.
