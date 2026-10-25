# Real-service verification

The application tests use fake Stripe responses and local/logged mail. A simulated checkout or an SMTP log is not proof that an external service works.

## Safe configuration status

```sh
php artisan integrations:check
```

Windows project runtime: `.\dev.ps1 php artisan integrations:check`. This command prints only configuration status. It makes no API call and sends no email without explicit options. Put credentials in your private `.env`, never in README, screenshots, command-line arguments or chat. Run `php artisan config:clear` after local changes; use `config:cache` again on the deployed server.

## Stripe test API and full checkout

1. Create or select a Stripe sandbox/test environment. Set its `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`; set `DEMO_PAYMENTS=false`.
2. Run `php artisan integrations:check --stripe`. It refuses live-key prefixes and requires an authenticated test-mode response. This verifies API authentication, **not webhook delivery**.
3. Locally, forward events using Stripe CLI: `stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to localhost:3000/stripe/webhook`. Use the signing secret printed by that listener. On Hostinger use the registered HTTPS endpoint's own test signing secret instead.
4. Open a previously unpurchased fictional property in a fresh browser context and buy it. Use only test payment details documented by [Stripe](https://docs.stripe.com/testing).
5. Confirm the return route unlocks only that property, the matching event receives HTTP 200, and a different browser remains locked. Check a declined/cancelled checkout, a forged webhook and expiry using the automated tests as well.
6. Record the deployment URL, date, test event ID and outcome privately. Never record keys or real customer data as portfolio evidence.

No live charge is necessary. Do not test with live credentials or real card information.

## SMTP submission and inbox delivery

Set `MAIL_MAILER=smtp` and your provider's exact host, scheme, port, username, password and authorised sender. Hostinger Email documents [its settings](https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/): normally `MAIL_SCHEME=smtps`, host `smtp.hostinger.com`, port `465`. For a provider-approved STARTTLS setup use `MAIL_SCHEME=smtp` with port `587` instead. Use settings for your actual mailbox product.

Send exactly one explicit test message to an address you control or have permission to use:

```sh
php artisan integrations:check --mail-to=your-test-recipient@example.com
```

The command refuses the log mailer. A successful SMTP submission means the server accepted the message; confirm its arrival in inbox/spam separately. Verify sender-domain SPF/DKIM using the mailbox provider's setup guidance. Then exercise one normal contact-form submission with consent. Do not publish mailbox credentials or private message contents.

## Current local status

At implementation time, no Stripe test key/webhook secret or SMTP mailer was configured. External API, webhook and inbox-delivery results therefore remain **pending credentials and a deployed endpoint**. The command and regression tests are provided so these checks can be repeated without weakening production security.

The owner confirmed on 25 October 2026 that credentials are not yet available and requested preparation for later. No external request or test email has been sent, and no recipient has been authorised. Local fake payments and logged mail remain the development defaults.

## Resume checklist

- [ ] Add Stripe test credentials and SMTP settings to the private `.env`; never use live payment keys for this check.
- [ ] Configure the test webhook for the deployed HTTPS URL and refresh Laravel's configuration cache.
- [ ] Run `php artisan integrations:check`, then `php artisan integrations:check --stripe`.
- [ ] Complete successful and rejected/cancelled Stripe test checkouts; verify the report remains locked without a confirmed payment and in another browser.
- [ ] Choose and explicitly authorise a test recipient, then run `php artisan integrations:check --mail-to=your-test-recipient@example.com`.
- [ ] Confirm inbox/spam delivery separately from SMTP acceptance and record the actual results/date.

Locally on Windows, prefix each Artisan command above with `.\dev.ps1` (for example, `.\dev.ps1 php artisan integrations:check --stripe`). On Hostinger, use the PHP binary selected in HOSTINGER.md.
