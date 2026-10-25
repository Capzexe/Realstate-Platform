# VeriSale — Setup and Integration Guide

See the [project README](../README.md) for the product overview and architecture decisions.

## Prerequisites

- A current patched PHP 8.4 or newer, with Laravel's required extensions, including `curl`, `mbstring`, `openssl`, `pdo_sqlite`, `sqlite3`, `fileinfo`, and XML/DOM.
- Composer 2.
- A modern browser.
- Optional: a Stripe test account and SMTP credentials for the corresponding integrations.

The project is verified on PHP 8.4.27. Commit `composer.lock` to keep dependency versions reproducible. Windows users can install the isolated runtime and use `dev.ps1`: see [PHP runtime setup](PHP-RUNTIME.md).

## Installation

1. Clone the repository and enter the project:

   ```sh
   git clone https://github.com/Capzexe/Realstate-Platform.git
   cd Realstate-Platform
   ```

2. Install PHP dependencies:

   ```sh
   composer install
   ```

3. Copy the environment file:

   ```sh
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env` instead. Keep `.env` private; it contains application and API secrets.

4. Generate the application key and create the local SQLite file:

   ```sh
   php artisan key:generate
   php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
   ```

5. Create tables and demonstration data:

   ```sh
   php artisan migrate --seed
   ```

   This adds 12 fictional properties and 36 sales across 10 cities. Seed data covers apartments, houses and land. Re-running the seeder adds missing examples and preserves non-demo records; it does not reset the database. `database/fixtures/properties.php` is the editable dataset. Tests run against an isolated in-memory SQLite database.

6. Start the application:

   ```sh
   php artisan serve --host=127.0.0.1 --port=3000
   ```

   Open [localhost:3000](http://localhost:3000). Keep the terminal running. On Windows, use `dev.ps1` to select the verified project PHP runtime.

## Usage

Search for **Brīvības**, **Jelgava**, or **Cēsis**. Every saved property's technical details, sales, charts and PDF are locked, including fictional fixtures. Select **Iegādāties atskaiti**, then **Apmaksāt testa režīmā** in the local checkout. The form displays fixed, read-only test details that are never submitted. A separate processing screen walks through the simulated authorization and server confirmation before the selected report opens for 24 hours in the current browser. **Izmēģināt noraidītu maksājumu** and **Atcelt** leave it locked. No money is charged and no actual card data is requested. With JavaScript disabled, a manual confirmation button completes the processing step.

Local simulation requires `APP_ENV=local` and `DEMO_PAYMENTS=true` in `.env` (enabled in `.env.example`). Run `php artisan config:clear` after changes. Production/staging ignore the switch, and simulated purchases are excluded from report authorization there. The public sample page shows a detached structural illustration, never details from a saved property.

The seeded addresses and transactions are illustrative. They are not verified records, market valuations, or a connection to a live property registry. The application reads its own database; import records you are entitled to use to build your dataset.

### Import property records

Use a UTF-8, comma-separated CSV with these required columns:

```csv
address,city,cadastre_number,transaction_date,price_eur
Example address,Rīga,99999999999,2024-06-20,89000
```

Cadastre numbers must contain 11 digits. Dates use `YYYY-MM-DD`; prices use euros with a decimal point and no thousands separator. Quote fields containing commas. One row represents one sale.

Optional columns: `type` (`Dzīvoklis`, `Māja`, or `Zeme`), `area_m2`, `rooms`, `floor`, `total_floors`, `construction_year`, `wall_material`, and `land_area_m2`. Supplied details update the matching property; omitted optional columns keep existing values. A blank optional value clears that field.

```sh
php artisan properties:import /path/to/properties.csv
```

`database/examples/properties.csv` shows the complete format with fictional records. Importing it creates another gated property. It is not a source of real records. Imports cannot overwrite the seeded fictional fixtures.

Re-importing the same property/date/price/kind does not duplicate a sale. If a row fails validation, the entire file is rolled back. This command imports or updates records; it does not delete missing rows.

### Optional Stripe Checkout

Use Stripe **test** credentials while developing:

```dotenv
STRIPE_SECRET_KEY=sk_test_...
DEMO_PAYMENTS=false
STRIPE_WEBHOOK_SECRET=whsec_...
APP_URL=http://localhost:3000
```

Forward local webhook events with the Stripe CLI:

```sh
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded --forward-to localhost:3000/stripe/webhook
```

Copy the signing secret printed by this command into `.env`, disable demo payments, clear configuration, and start checkout from a property's preview page. Configure the same events on the deployed webhook endpoint when going live.

Laravel sets the €9.99 amount on the server and verifies the Checkout session's identity, payment status, amount, currency, and property before unlocking the report. Webhooks require Stripe's signature; repeated events do not extend access. The local simulator is an explicit environment-gated mode, never a fallback for failed Stripe payments.

Purchases are stored in the database. Ownership is tied to the current browser's server-side session, with a 24-hour report expiry. Clearing cookies or losing the session loses access; this small application has no accounts or cross-device recovery. The default session lifetime is 1,440 minutes. Professional and agency plans are contact enquiries, not implemented recurring subscriptions.

### Contact email

`MAIL_MAILER=log` writes development messages to `storage/logs/laravel.log`. The UI explicitly says they were logged rather than emailed. To deliver email, configure `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, and `CONTACT_EMAIL` in `.env`. Use `MAIL_SCHEME=smtps` if your provider requires implicit TLS.

## Tests and formatting

```sh
composer test
composer format
```

The feature suite covers pages, search, demo seeding, CSV imports, access expiry, payment verification, webhook signatures, and contact validation. It uses an in-memory SQLite database and fake HTTP responses; it does not charge cards or email real recipients.

Real Stripe payments and SMTP delivery require your credentials and a separate integration check.

## Deployment notes

Follow [the security audit and deployment guide](SECURITY-AUDIT.md) and adapt one of the server examples in `deploy/`. Those files require the real domain, certificate, filesystem paths and web PHP settings before use. Private files are not automatically served, and no storage symlink is needed.

Point the web server at `public/`, use HTTPS, set `APP_ENV=production`, `APP_DEBUG=false`, the correct `APP_URL`, and `SESSION_SECURE_COOKIE=true`. Keep `.env`, the SQLite database, and logs outside the public document root. Allow PHP to write to `storage/`, `bootstrap/cache/`, and the SQLite database directory. Use persistent storage for the database and sessions, then run:

```sh
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan view:cache
```

Do not seed fictional records on a production dataset unless you want those test properties listed. Keep database backups. This version supports one application instance with local file sessions/cache; shared hosting across multiple instances requires shared stores.
