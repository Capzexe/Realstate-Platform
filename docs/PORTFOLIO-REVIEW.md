# Portfolio readiness review

Reviewed locally on **25 October 2026**. The original review below is a historical snapshot; the release-preparation update immediately below records subsequent work. Neither is a production certification or a WCAG conformance audit.

## Release-preparation update — 25 October 2026

- Added field-level Latvian contact/search validation with linked error descriptions and retained input.
- Added an approximately 90-second native purchase-flow recording, Latvian captions and a `/demo` player. No real money or customer data was used.
- Added isolated Playwright desktop/mobile tests for the protected purchase flow, rejected payments, field errors and video playback/captions. GitHub Actions runs these checks and preserves browser evidence; this updated workflow has not yet been pushed or verified on GitHub.
- Measured local mobile-simulated Lighthouse performance: home **70**, pricing **72**. Accessibility, best-practices and SEO automated categories scored **100** on both pages. See [PERFORMANCE.md](PERFORMANCE.md) for actual metrics and limitations; these are not Hostinger or field results.
- Prepared a credential-free source upload package and [Hostinger HTTPS deployment guide](HOSTINGER.md). DNS, certificate, Force HTTPS and server configuration still require verification after upload.
- Added a safe integration-check command and [Stripe/SMTP verification procedure](INTEGRATION-VERIFICATION.md). Real Stripe credentials and SMTP settings were absent; external Checkout/webhook and inbox delivery remain unverified.

The deployment and real-service items remain open; localization, browser automation, video and baseline performance measurement from the original action list have now been implemented.

Release-preparation verification: **68 PHP tests / 546 assertions**, Pint and production route-cache generation passed. The six desktop/mobile browser checks passed as a full run; subsequent targeted validation and video checks passed after adding top-aligned screenshot capture and server-supported video seeking. The HTTP test also verifies `206 Partial Content` for a video byte range. Updated CI has not yet run on GitHub.

## Verdict

The application is a credible junior Laravel portfolio case study: simple MVC, a real database, validated imports, server-side purchase authorization and meaningful tests. The main remaining obstacles are making the current version accessible to reviewers and demonstrating it clearly. It should be presented as a fictional property-history/report demo, not a live registry or valuation service.

## Verified evidence

| Area | Result |
| --- | --- |
| Application/security suite | 61 tests and 499 assertions passed again after the review fixes. Includes fake/Stripe payment isolation, signature checks, ownership, expiry, CSRF, throttles, imports and public-data boundaries. |
| Composer metadata | `composer validate --strict` passed. |
| Dependencies | `composer audit --locked --format=json` returned no reported advisories or abandoned packages at review time. This does not audit the PHP runtime or guarantee the absence of vulnerabilities. |
| Formatting/runtime | Laravel Pint passed after edits; `composer check-platform-reqs` passed on project-local PHP 8.4.27. |
| Browser checks | At 390px: home, pricing, sample, about, contact, empty results, missing page and protected report redirect had one H1, no missing input labels or image alt attributes, and no horizontal overflow. The mobile menu opens/closes and updates its state. No captured browser warnings/errors. These checks do not establish complete accessibility conformance. |
| Stress case | A valid 200-character unbroken query initially produced a 1742px document at a 320px viewport. After wrapping was fixed, no horizontal overflow was observed at 320px, 390px or 1440px. |
| GitHub access | Repository was PRIVATE at review time. Recruiters without access cannot browse or clone it. No visibility settings were changed. |
| Hosted CI | Latest inspected run succeeded for commit `d1f3c57f8ee0dd9c95c7c72df0367e1f6cd223e6`: [run 40100135504](https://github.com/Capzexe/Realstate-Platform/actions/runs/40100135504). New checkout, address/hero updates and review edits remain local until committed/pushed. |
| Sensitive local files | Git's tracked-file check found `.env.example`, but no tracked `.env`, SQLite database or project runtime files in the checked paths. This was not a historical secret scan. |

## Fixed in this review

- Allowed long, valid search text to wrap inside the shared hero instead of widening a phone screen.
- Replaced “Atrasti 1 īpašumi” with the grammatically stable “Rezultātu skaits: 1”.
- Removed an unused latest-transaction query and unused request parameters from `PropertyController`; report authorization remains server-side.
- Updated README screenshots, corrected the outdated CI statement, and made the Stripe setup instructions explicitly disable local simulation and clear configuration.

## Prioritized remaining work

| Priority | Finding and impact | Concrete next step |
| --- | --- | --- |
| P1 — before sending a CV link | The repository is private and the latest work is unpushed. A reviewer may see an older version or no project at all. | Review the diff, commit/push the intended changes, verify CI for that exact commit, then deliberately choose a public portfolio repository or provide reviewer access. Keep environment files, databases and runtime files excluded. |
| P1 — presentation | README has no public demo or walkthrough URL. A recruiter must install the project to see the main flow. | Publish an HTTPS demo and a 60–90 second walkthrough: search → locked preview → checkout → processing → report/PDF. A public read-only sample plus a local-flow video is enough initially. Add real links to README. |
| P2 — deployment/integration evidence | Stripe is tested through fake HTTP responses; external Checkout/webhook delivery and SMTP have not been verified with real services. | Complete one Stripe sandbox/test-mode end-to-end run and an SMTP delivery check in a controlled environment; document the result. Keep production protections enabled. Do not expose the local simulator by setting a public server to `APP_ENV=local`. |
| P2 — error UX/accessibility | The UI is Latvian, but no `lang/lv/validation.php` exists. Contact fields have labels but no field-level `aria-invalid`, linked error descriptions or inline error output. The layout currently shows a global error summary. | Add Latvian validation messages, place errors beside their fields, connect them with `aria-describedby`, and verify keyboard/screen-reader recovery with input preserved. Default-language messages may currently fall back to English. |
| P2 — measurable performance | The interior JPEG is about 763 KiB; font/image optimization has not been benchmarked. | Measure the public build on mobile first, then consider responsive image variants and WOFF2 fonts. Record actual before/after bytes and performance results; do not invent speed improvements or scores. |
| P2 — discoverability | The shared head has a generic description and no project favicon/social preview metadata. | Add a small brand favicon and page-specific descriptions/social previews using a verified deployed URL. These improve the link's presentation without adding a new feature. |
| P2 — browser regression evidence | CI runs HTTP/database tests, but there is no automated browser journey. A CSS or JavaScript regression can pass the current suite. | Automate one browser path covering a suggested address, locked report, simulated checkout processing and successful report access, plus a declined-payment case. Keep the local simulator's environment restrictions intact. |
| P3 — future business feature | Purchases belong to one browser session and expire after 24 hours. Clearing cookies or changing devices loses access. | Explain this limitation in the demo. Add accounts/recovery only if it becomes the next product goal; it is not required to demonstrate this portfolio's current scope. |

## Deployment and demo boundary

Production behavior should use the documented HTTPS origin, `APP_ENV=production`, debug off, secure cookies and `DEMO_PAYMENTS=false`, with the web root restricted to `public/`. Apply and verify the supplied host templates on the actual server; they are not installed here. Laravel's [deployment guidance](https://laravel.com/framework/docs/12.x/deployment) covers the production setup.

For a public paid-flow demonstration, Stripe supports transactions in an isolated testing environment without moving funds. Use test credentials and an explicit demo notice; no real card details are needed. See [Stripe testing](https://docs.stripe.com/testing). The local simulator intentionally remains unavailable in production.

Latvian error localization can be implemented with Laravel's language files; the skeleton does not include them automatically. See [Laravel localization](https://laravel.com/framework/docs/12.x/localization).

## Interview demonstration

Be ready to explain and trace these decisions in the code:

1. Why hiding prices in CSS would leak data, and where this app authorizes before rendering transactions.
2. How a pending purchase becomes paid, how browser ownership is checked, and why replay cannot extend expiry.
3. Why an unsigned browser event cannot act as a Stripe webhook and why a missing key never enables production simulation.
4. How CSV validation and a database transaction prevent a partially imported file.
5. Why SQLite and ordinary Blade/MVC suit this scope, and what would change for multiple deployed instances.

The next step is presentation and deployment evidence, not a rewrite into React or a larger abstraction layer. Describe your own contribution and use of development tools accurately, and be able to reproduce the key flow without relying on a script.

## Verification limits

No fresh-machine installation, production server, public DNS/TLS, live Stripe account, SMTP service, historical secret scan, automated browser test suite, full screen-reader pass, performance benchmark or coverage report was verified in this review. Existing feature tests provide HTTP/database evidence, not proof that every browser interaction works. Do not present this review as a penetration-test certificate or a guarantee of job readiness.

## Final verification

Post-fix checks passed: **61 tests / 499 assertions**, Pint, Composer platform requirements and `git diff --check`. README/review relative file links resolve. Composer metadata validation and the current advisory audit also passed during this review.

Fresh visual/source review returned **SHIP** for the two UI fixes only; it did not certify the entire application. Captures show normal and 200-character search results at mobile/desktop sizes. The 320px case is supported by a browser DOM width check, not a screenshot. The visual detector engine remained unavailable, as already recorded in the design workflow.
