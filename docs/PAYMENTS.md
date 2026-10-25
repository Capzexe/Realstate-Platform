# Report paywall and payment architecture

This is the Laravel implementation of the report-paywall contract. The previous React/Express prototype has been replaced by Blade, Laravel controllers, Eloquent and SQLite. There is no Supabase client, JSON report API or in-memory payment store in this version.

## Request mapping

| Operation | Current route | Responsibility |
| --- | --- | --- |
| Search | `GET /ipasumi?q=...` | Validate the search and render public results. |
| Teaser | `GET /ipasumi/{property}` | Render address, city and type before purchase. |
| Start checkout | `POST /ipasumi/{property}/checkout` | Choose the configured payment mode and create a pending purchase for this browser session. |
| Simulator | `GET /checkout/{purchase}/demo` | Display an owned local demo order without unlocking it. |
| Prepare simulation | `POST /checkout/{purchase}/demo/prepare` | Validate CSRF and ownership, then store only the selected test scenario in the server session. |
| Processing screen | `GET /checkout/{purchase}/demo/processing` | Show the prepared scenario's stages; no payment or report access is granted by this GET. |
| Confirm outcome | `POST /checkout/{purchase}/demo` | Validate CSRF, ownership and a matching prepared `success`/`failed` outcome. `cancelled` is also available directly. |
| Stripe return | `GET /checkout/{purchase}/success?session_id=...` | Check ownership and retrieve the matching session directly from Stripe. |
| Stripe webhook | `POST /stripe/webhook` | Verify Stripe's signature on the original request body before accepting an event. |
| Full report | `GET /ipasumi/{property}/atskaite` | Authorize a paid, owned, unexpired purchase before loading transaction history. |

## Public data boundary

Public search queries select only `id`, `address`, `city`, `type` and `is_demo`. The last field labels fictional fixtures; it grants no access. A locked property page renders only its address, city, type and generic purchase information. It does not serialize the model into JavaScript, hidden fields or HTML data attributes.

Technical fields, cadastre details, transaction dates, counts, prices, charts and print controls are withheld until purchase. These are stricter teaser rules than the supplied prototype specification, which allowed room counts, area and construction year. Keep the current stricter boundary unless the product requirements explicitly change.

Marketing report samples use unsaved illustrative records, independent of saved properties. Owner identities, tax history, comparable sales and market valuations are not implemented; do not describe them as available report data.

## Payment modes

The simulator requires **both** `APP_ENV=local` or `testing` and `DEMO_PAYMENTS=true`. It is an explicit mode, taking precedence over configured Stripe keys. It collects no card information and makes no Stripe calls. A successful simulation marks only its owned `demo` purchase paid; failure and cancellation leave it pending.

The checkout shows fixed read-only illustrative card, email and name fields with no HTML `name` attributes, so these values are not submitted. After pressing the payment button, a separate processing page presents four local stages over roughly four seconds, then submits the final CSRF-protected confirmation. Reduced-motion preference shortens the sequence; without JavaScript, a visible button provides manual confirmation. The timing is presentation, not a security control: server ownership, prepared scenario, provider, environment and CSRF checks enforce access. A mismatched or unprepared confirmation is rejected. The interface never claims an actual Stripe connection, bank authorization or verified webhook for this simulation.

Set `DEMO_PAYMENTS=false`, supply `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, then clear configuration to use Stripe. Laravel chooses the EUR 9.99 amount on the server. Missing credentials or a Stripe failure return an error; they never silently enable a simulator. Production and staging reject simulation even if the demo flag is enabled.

Real payment confirmation checks the stored Checkout session ID, paid status, payment mode, EUR currency, amount, purchase reference and property metadata. Signed `checkout.session.completed` and `checkout.session.async_payment_succeeded` events can complete matching Stripe orders. The return route also verifies with Stripe, so merely visiting a success URL cannot unlock a report.

The simulator has its own CSRF-protected endpoint. **Never send unsigned simulator events to the Stripe webhook or bypass signature checks when a key is missing.** The server-assigned `payment_provider` prevents either flow from completing the other provider's purchase.

## Persistence and access

SQLite stores properties, transactions and purchases. `purchases` holds the property association, provider, optional Stripe session ID, payment timestamp and expiry. The encrypted server-side browser session holds owned purchase IDs; a URL ID alone is not an access token. There are no accounts or cross-device recovery yet.

`PropertyPolicy::viewReport` requires an owned purchase for that property, a payment timestamp and an expiry strictly after the current time. Demo purchases are eligible only while demo mode is enabled in a local/test environment. Stripe purchases remain eligible in either mode. Disabling demo mode or deploying the database to production does not turn simulated purchases into real access.

`Purchase::markPaid()` updates only unpaid rows and assigns a 24-hour expiry. Replayed callbacks, webhooks or simulator confirmations cannot renew that window. Report requests use the persisted purchase, so access survives application restarts when the database and browser session remain available. Once the window expires, a new purchase is required.

Unknown addresses return no matches. The app never invents property records in response to a search and never silently substitutes fake data after a database failure. Fictional records enter only through explicit seed data. Any future Supabase integration must preserve this distinction and keep service-role credentials exclusively on the server.

## Regression checks

```sh
php artisan test --filter=DemoCheckoutTest
php artisan test --filter=CheckoutTest
```

On Windows with the project runtime, prefix Artisan commands with `.\dev.ps1 php`. Tests use an isolated in-memory SQLite database and fake Stripe responses; no real payments occur.

Coverage includes data absent from unpaid HTML, direct-report denial, success/failure/cancellation, property and browser ownership, provider isolation, missing credentials, forged webhook signatures, verified payment fields, production mode, CSRF, throttling, expiry and replay. Before real deployment, separately test Stripe test-mode Checkout and webhook delivery using your own credentials.
