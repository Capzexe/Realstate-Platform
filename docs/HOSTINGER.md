# Hostinger: HTTPS portfolio deployment

This guide prepares a deployment; it does not claim that a domain, certificate, mailbox or Stripe endpoint has already been provisioned. The application requires PHP **8.4+**. Node is needed only on your development machine/CI for browser tooling, not on the production web server.

## 1. Choose the private/public directory layout

On Windows, run `.\scripts\package-hostinger.ps1` from the repository to generate an ignored `artifacts/hostinger/upload-*.zip`. This source-only archive contains the private `verisale/` folder, public assets and both prepared front-controller templates. It deliberately excludes credentials, databases, logs, Node tools and `vendor/`; install production dependencies by SSH as below. Extract it at the domain directory level, **not inside `public_html/`**. Upload generated demo media before building the archive.

Use an empty site/domain or a backup of the existing site. Keep the application outside the served directory:

```text
/home/ACCOUNT/domains/your-domain.example/
  verisale/                  # private Laravel app, vendor, .env, SQLite, storage
  public_html/               # contents of public/ only
    index.php                # copy deploy/hostinger-index.php here
    .htaccess                # copy deploy/hostinger.htaccess here
    css/ js/ fonts/ media/   # public assets (video is in media/demo/)
```

The generated archive already separates `verisale/` and `public_html/` and installs the supplied front-controller templates. If deploying manually from a checkout, upload private source to `verisale/`, copy its `public/` contents to `public_html/`, and replace the public front controller and `.htaccess` with the Hostinger templates. Their paths assume the private sibling is named **verisale**. Never upload `.env`, `vendor/`, `database/` or `storage/` inside `public_html/`. Do not create a public storage symlink.

## 2. PHP and HTTPS in hPanel

Select PHP **8.4** and enable the extensions listed in README, especially SQLite/PDO SQLite, mbstring, cURL and OpenSSL. Check both the web version and SSH version; these can differ. Hostinger documents [PHP configuration](https://www.hostinger.com/support/1575755-how-to-change-the-php-version-of-your-hostinger-hosting-plan/) and [Composer's CLI PHP selection](https://www.hostinger.com/support/5792082-how-to-solve-common-composer-issues-at-hostinger/).

Install the domain's SSL certificate in hPanel and keep **Force HTTPS** enabled. See [Hostinger HTTPS settings](https://www.hostinger.com/support/1583201-how-to-enable-or-disable-https-for-your-website-at-hostinger/). The Laravel middleware additionally checks the configured HTTPS origin. No local/self-signed certificate is shipped as a substitute for your domain's certificate.

## 3. Private environment and installation

In the private `verisale/` folder, copy `deploy/hostinger.env.example` to `.env` (the upload archive instead includes that template as `.env.example`). Replace the domain, account, absolute database path and email settings. Keep `APP_ENV=production`, `APP_DEBUG=false` and `DEMO_PAYMENTS=false`.

Example SSH commands (use your own account/domain):

```sh
cd ~/domains/your-domain.example/verisale
/opt/alt/php84/usr/bin/php /usr/local/bin/composer2 install --no-dev --optimize-autoloader --no-interaction
/opt/alt/php84/usr/bin/php /usr/local/bin/composer2 check-platform-reqs
# First installation ONLY: generate APP_KEY if it is blank. Never rotate an existing key casually.
/opt/alt/php84/usr/bin/php artisan key:generate
# First installation ONLY, if the database file does not exist:
test -f database/database.sqlite || touch database/database.sqlite
/opt/alt/php84/usr/bin/php artisan migrate --force
# Optional fictional examples; safe repeatable seeding, never migrate:fresh:
/opt/alt/php84/usr/bin/php artisan db:seed --force
/opt/alt/php84/usr/bin/php artisan config:cache
/opt/alt/php84/usr/bin/php artisan route:cache
/opt/alt/php84/usr/bin/php artisan view:cache
```

Use the PHP binary available on your account if its path differs. Only the private `storage/`, `bootstrap/cache/` and SQLite directory need write access. Keep code and environment files protected; do not use `chmod -R 777`. Back up the SQLite file before upgrading a populated application. When changing `.env`, rebuild the configuration cache.

## 4. Public demo and video

After deploying the public assets, `https://your-domain.example/demo` contains the native recording with Latvian captions. Home, sample reports and fictional address searches work without external credentials. The local fake checkout is intentionally unavailable in production. Do not expose it by changing the hosting environment to `local`.

For an interactive portfolio checkout, connect **Stripe test/sandbox** credentials, keep production protections enabled, and clearly label the site as a portfolio demo. Register `https://your-domain.example/stripe/webhook` in the same Stripe test environment for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.

## 5. Verify after upload

```sh
curl -I http://your-domain.example/cenas
curl -I https://your-domain.example/cenas
curl -I https://your-domain.example/.env
curl -I https://your-domain.example/database/database.sqlite
curl -I https://your-domain.example/storage/secret.txt
```

HTTP must redirect to HTTPS; private paths must return 403/404 without contents. Check production cookies are Secure/HttpOnly/SameSite=Lax, the video plays with captions, search works and direct unpaid report requests return to the locked preview. Inspect the browser console for CSP errors. Edge templates need actual Hostinger validation; they were not installed or server-syntax-tested here.

Finish the external checks in [INTEGRATION-VERIFICATION.md](INTEGRATION-VERIFICATION.md). Replace the README demo URL only after the deployed address is verified.
