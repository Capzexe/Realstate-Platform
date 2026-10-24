# Application security audit

Reviewed on **24 October 2026** against the running Laravel 12 application, installed framework code, Laravel documentation and OWASP guidance. This is a source/configuration review with regression tests, not a penetration-test certification.

## Scope and application boundaries

Reviewed routes, controllers, models, imports, Blade output, sessions, filesystem configuration, Stripe checkout/webhooks, dependency advisories and selected local PHP settings. No production infrastructure, DNS, certificate, live Stripe account, SMTP service, Git history or backup service was available for verification.

The app has **no user accounts, login/password-reset endpoints, API tokens, Sanctum/JWT installation, browser uploads or administrative HTTP writes**. Public property previews and fictional demo reports are intentional. A real report requires a purchase owned by the current server-side browser session, a verified payment and an unexpired access period. Account recovery and cross-device purchases are not implemented.

## Findings, fixes and verification

Severity below is contextual; deployment-dependent risks are explicitly marked.

| Finding / risk | Example attack or failure | Implemented fix | Verification |
| --- | --- | --- | --- |
| **High if deployed:** no enforced HTTPS / Secure session default | An HTTP visit sends a session over an unencrypted connection, allowing a network attacker to reuse paid access. | `EnsureSecureTransport` requires a configured HTTPS origin outside `local`/`testing`, rejects other hosts and redirects HTTP with 308. Session cookies are Secure, HttpOnly, host-only and SameSite=Lax in deployed environments. | `SecurityTest`: production redirect, bad origin/host, session configuration and cookie tests. Verify real HTTP redirects and TLS after deployment. |
| **High if deployed:** debug could be enabled by production environment configuration | An attacker triggers a failed request and receives stack traces and configuration details. | `config/app.php` permits debug only in explicitly local/testing environments, regardless of `APP_DEBUG=true` elsewhere. | `test_deployed_configuration_cannot_enable_debug_or_insecure_cookies`. PHP-level errors additionally require the supplied INI profile. |
| **Medium:** no CSP or framing/resource headers | An injected script has no browser policy limiting execution; an attacker can frame the report to trick users into clicking. | Global `SecurityHeaders` plus the exception response hook set CSP, DENY, nosniff, referrer and permissions headers. HSTS is sent on deployed HTTPS responses. Inline hero styling was replaced with an image/CSS class so CSP needs neither `unsafe-inline` nor `unsafe-eval`. | Header/error tests; browser checks; inspect production static/error responses with the edge configuration. CSP is defense in depth, not a replacement for escaping. |
| **Medium:** unthrottled payment-status callback | A visitor repeatedly refreshes an owned checkout return URL, causing repeated authenticated Stripe API calls. | Named `checkout-status` limit: 10/minute/IP. Other named limits cover checkout (10), contact (5), search (60) and webhooks (120). | Callback test makes 10 fake requests, receives 429 on the next, and asserts no additional upstream call. |
| **Medium:** contact/query validation accepts unexpected shapes until rendering | `subject[]=bad`, `q[]=bad` on a public page, or array-shaped flashed contact input causes a 500, and may expose a trace when debug is enabled. | Dedicated FormRequests validate scalar types/lengths; contact rendering and shared search components safely handle arrays. Pagination is bounded. Only validated search parameters are propagated. | Array-shaped query, shared-component and flashed-input tests; contact header-injection and escaped-output tests. |
| **Low / preventive:** paid-access flags were mass assignable on Property | A future update endpoint using `fill()` could accidentally set `is_demo=true`, making a real report free. No such endpoint currently exists. | Removed `is_demo` from `$fillable`. Seeder explicitly assigns it only for newly created examples. Purchase payment/ownership fields remain excluded from mass assignment. | Mass-assignment test plus existing idempotent seed/import tests. |
| **Preventive:** report authorization duplicated in controllers | A future controller might skip the ownership/expiry check while rendering paid transaction prices. Existing checks were already effective. | `PropertyPolicy::viewReport` and `PurchasePolicy::view` centralize the checks. Gates run server-side; undefined mutation abilities deny access. | Ownership, expiry, anonymous policy and undefined-action tests. |
| **Low / robustness:** malformed upstream/payment JSON could cause a 500 | A malformed Stripe response or signed event supplies arrays where scalar IDs are expected. | Validate consumed nested fields after signature verification; reject non-array API responses. Do not follow upstream redirects while sending the Stripe bearer credential. Checkout destination remains restricted to Stripe's HTTPS checkout host. | Nested signed-event, malformed JSON, wrong amount/currency/property, forged-signature and redirect tests. |
| **Preventive:** private disk allowed generated serving routes | Future temporary URLs could expose private material without the intended report policy. No upload/download route currently exists. | Disabled automatic serving for the private local disk; private visibility and storage errors enabled. No public storage symlink is required. | Private disk configuration and missing public URL tests. |
| **Medium if deployed:** PHP runtime/settings are development defaults | PHP-level errors disclose paths; an attacker who finds a separate code-execution flaw can invoke OS commands. | Added a web-SAPI INI example and Nginx/Apache vhosts. **Host changes are not installed by this audit.** | Local CLI inspection found PHP **8.2.12**, `expose_php=1`, `display_errors=1`, no `open_basedir` or `disable_functions`. Apply the host profile and verify the actual web SAPI. |

## Controls already present and retained

**Runtime follow-up:** after the initial audit, the project received a verified, isolated PHP **8.4.27** installation and its localhost server was moved to that runtime. The suite and Composer platform checks pass there. The earlier PHP 8.2.12 finding records the initial XAMPP state; shared XAMPP and any production host were not upgraded. See [runtime setup](PHP-RUNTIME.md).

- No controller uses `request()->all()` for persistence; models have explicit `$fillable`. No `$guarded = []`, executable user input, unsafe Blade raw HTML or interpolated SQL was found in the reviewed application paths.
- The search scope's `whereRaw("search_text LIKE ? ESCAPE '!'", [$boundValue])` uses a bound parameter and escapes LIKE wildcards. This is safe raw SQL; it was retained and tested with SQL injection strings.
- Contact mail uses validated fields and a configured recipient. CR/LF characters are now also rejected in the sender name and email header fields.
- Validation and contact/checkout failure redirects use fixed internal routes instead of a caller-supplied Referer header.
- Browser POST forms use Laravel CSRF protection. Only `/stripe/webhook` is excluded; it verifies Stripe's timestamped signature on the original raw request body before using any event data.
- The browser cannot choose price, paid status, expiry or property ownership. Stripe sessions must match the stored session, paid/payment state, EUR currency, configured amount, reference and property. Repeated paid events do not extend expiry.
- `.env` is ignored and application secrets are read through environment-backed configuration. No key values were printed. This does **not** prove no secret was ever committed: repository history and external systems were not inspected. Rotate any previously exposed credentials and application keys using a planned migration, not blind replacement.
- `composer audit --format=json` reported **no advisories or abandoned packages** at review time. This does not audit PHP itself or guarantee absence of vulnerabilities.

## Code map

- `bootstrap/app.php`: global middleware, CSRF exception and error-response headers.
- `app/Http/Middleware/`: security headers, secure transport/canonical host and explicit proxy trust.
- `config/security.php`: HTTPS environment boundary, proxy allowlist and request size.
- `config/session.php`: encrypted session storage and fixed cookie protections.
- `config/app.php`: production debug restriction.
- `app/Http/Requests/`: contact, search, sample and checkout-return validation.
- `app/Policies/`: browser-session report and purchase authorization.
- `app/Providers/AppServiceProvider.php`: policy registration, canonical URL generation and named rate limits.
- `app/Http/Controllers/CheckoutController.php`: verified payment flow and signed nested event validation.
- `config/filesystems.php`: private local storage without public serving.
- `tests/Feature/SecurityTest.php` and `CheckoutTest.php`: executable attack/regression cases.

The original authentication config referenced a removed User model. It now uses an explicitly anonymous Laravel request guard. Nullable-user policy methods are deliberate: this app sells access to a browser session, not an account. **Do not add login routes to this guard**; implement complete account authentication before introducing those features.

## Deploying the protections

1. Update the old PHP patch release to a current patched version supported by the application and its dependencies. PHP 8.2 has security support only through 31 December 2026; plan migration and rerun tests on the chosen runtime. See [PHP supported versions](https://www.php.net/supported-versions.php).
2. Choose **one** server example: `deploy/nginx.conf.example` or `deploy/apache-vhost.conf.example`. Replace the example domain, certificate paths, release directory and FPM socket. Point the document root **only** at `public/`. These files are templates, not installed or syntax-tested on a Linux web server here.
3. Apply `deploy/php-production.ini` to the **web** PHP-FPM/Apache SAPI, adjusting real paths. Provision a private writable PHP error log. Keep a separate CLI configuration: Composer/Artisan may need process functions. This app uses cURL for Stripe and SMTP for mail; the profile disables URL streams, process execution and browser file uploads. Enabling `open_basedir` reduces filesystem scope but is not a sandbox and disables the realpath cache; OS permissions remain essential. See the [PHP core INI manual](https://www.php.net/manual/en/ini.core.php).
4. Configure environment values before caching:

   ```dotenv
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-real-domain.example
   SESSION_DRIVER=file
   SESSION_LIFETIME=1440
   CACHE_STORE=file
   LOG_LEVEL=warning
   MAIL_MAILER=smtp
   TRUSTED_PROXIES=
   ```

   Supply the real `APP_KEY`, SMTP credentials, Stripe secret and webhook signing secret through private environment/secrets storage. Never copy example keys into production. Keep `APP_URL` to one HTTPS origin with no path, credentials, query or fragment. HSTS intentionally omits `includeSubDomains` and `preload` until every affected hostname has verified TLS.

5. With Nginx/Apache directly terminating TLS, keep `TRUSTED_PROXIES` empty. Behind your own reverse proxy, list only its exact private IPs/CIDRs; make it overwrite forwarded headers and firewall the origin so clients cannot bypass it. Forwarded host/prefix headers are never trusted. `*`, `**` and `REMOTE_ADDR` trust shortcuts are ignored. Do not use entire public address ranges as trusted proxies.
6. The current deployment uses one instance with persistent file sessions/cache and SQLite. The runtime OS account needs write access only to `storage/`, `bootstrap/cache/`, and the SQLite database directory (including SQLite journal files). Code and `.env` should be readable but not writable by that account. Never use `chmod -R 777`. Keep backups encrypted and outside the web root; restrict/rotate logs because development mail logs contain contact details. Multiple instances require shared sessions and a shared rate-limit cache such as Redis.
7. Install and cache configuration with the separate CLI runtime:

   ```sh
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

   Existing unencrypted sessions may be invalidated by the session-encryption change; the production `__Host-` cookie name also starts a new session. Schedule this migration and resolve existing purchases before deployment. Do not rotate `APP_KEY` casually: it also affects encrypted session data. Do not run `storage:link` for private reports. Never expose `artisan serve` as the production server.

8. Validate the selected host config (`nginx -t` or `apachectl configtest`), restart the matching services and verify the **web** SAPI's effective settings via restricted operator tooling. CLI `php --ini` does not prove FPM's settings. Do not publish `phpinfo()` or an environment-dump endpoint.

## Running the security checks

```sh
composer test
php artisan test --filter=SecurityTest
php artisan test --filter=CheckoutTest
composer audit
php vendor/bin/pint --test
```

Tests use an isolated in-memory database and fake Stripe responses; no cards are charged or real messages emailed. CSRF coverage explicitly switches out of Laravel's test-environment bypass. Configuration tests load the actual production settings with deliberately insecure environment values.

After deploying, replace the domain below and run read-only checks:

```sh
curl -I http://your-real-domain.example/cenas
curl -I https://your-real-domain.example/cenas
curl -I https://your-real-domain.example/missing-page
curl -I https://your-real-domain.example/css/app.css
curl -I https://your-real-domain.example/.env
curl -I https://your-real-domain.example/storage/secret.txt
```

Expect HTTP → HTTPS 308; all HTTPS responses including static/404 responses carry the headers; dotfiles/private paths never return contents (403/404). HTTP must never render forms. Inspect Set-Cookie in the browser: session has `Secure; HttpOnly; SameSite=Lax`, path `/` and no Domain. Confirm DevTools has no CSP violations during search, contact validation, pricing, samples, report printing and Stripe test checkout. Verify certificates and proxy configuration separately. Headers on the local PHP development server's static assets are outside Laravel's middleware, which is why the edge examples also set them.

## Future upload feature: exact safe starting point

**Not installed as a route:** there are no accounts, ownership-based edit policies or upload business requirements yet. The current PHP deployment profile disables uploads. Add complete authentication and an owner/admin `update` policy first. This example stores PDF attachments under random server-generated names; original names never become paths. Validate MIME from file contents, size and allowed extension. MIME validation is not malware scanning; quarantine/scan PDFs before distributing them if this becomes a real document-sharing feature.

```php
// app/Http/Requests/StoreAttachmentRequest.php (future feature)
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\File;

class StoreAttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null
            && Gate::allows('update', $this->route('property'));
    }

    public function rules(): array
    {
        return ['document' => ['required', File::types(['pdf'])
            ->extensions(['pdf'])->max(5 * 1024)]]; // max is KB: 5 MiB
    }
}

// In a future authenticated controller, after FormRequest authorization:
public function store(StoreAttachmentRequest $request, Property $property): Response
{
    // store() generates a random filename; the local disk is storage/app/private.
    $path = $request->file('document')->store('attachments', 'local');
    // Persist $path in an attachment record associated with $property and its owner.
    // Do not publish a storage symlink or return a direct download URL.
    return response()->noContent();
}
```

The example controller needs the normal `use` imports for the FormRequest, Property and `Illuminate\Http\Response`, plus an attachment model/migration that fits the future feature. It is intentionally a starting point rather than an unused upload subsystem. Before enabling it, add metadata persistence and cleanup on DB failure, enable PHP uploads, and raise the Nginx/Apache, PHP and application body limits slightly above 5 MiB to allow multipart overhead. Downloads must load that attachment from the database, run an owner/admin policy, and return a download/attachment response with `nosniff`; never accept a filesystem path from the request.

Test the future feature with real PDF bytes (not only a fake client MIME header), an oversized file, a renamed executable, SVG/HTML, traversal filenames and another user's property. Expect 422 for invalid files, 403 for unauthorized owners, random stored basenames and no public `/storage` access. Laravel documents [file validation](https://laravel.com/framework/docs/12.x/validation#validating-files).

## Future accounts / API: requirements before enabling routes

There is no current login, reset, logout or API token code to secure or revoke. Prefer Laravel's maintained authentication tooling rather than a custom password implementation. Replace the anonymous guard only as part of that complete feature. Add named login/reset limits keyed by both IP and a hash of a **validated scalar** email, with an additional IP-only ceiling. Keep password-reset responses generic so an attacker cannot enumerate accounts.

```php
// Example named limit AFTER the account feature exists:
RateLimiter::for('login', function (Request $request) {
    $email = $request->input('email');
    $identity = hash('sha256', is_string($email) ? mb_strtolower(trim($email)) : '');
    return [Limit::perMinute(20)->by('ip:'.$request->ip()),
        Limit::perMinute(5)->by('identity:'.$request->ip().':'.$identity)];
});
RateLimiter::for('password-reset', fn (Request $request) => Limit::perMinute(3)->by($request->ip()));
// Attach ->middleware('throttle:login') / ->middleware('throttle:password-reset')
// to the real auth routes. Keep Laravel's broker expiry and per-user reset throttle.

// Session logout, for a future session-based account guard:
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

For a first-party browser UI, use Sanctum's cookie/session mode and CSRF rather than putting bearer tokens in localStorage. For a future machine/mobile API, issue short-lived, narrowly scoped tokens (e.g. `['reports:read']` with explicit expiry), store secrets in the client's secure credential store, and never log plaintext tokens. Protect routes with `auth:sanctum`, named API throttles, ability middleware and a model policy. Sanctum stores token hashes; token revocation deletes the token record. Bearer-token logout revokes `currentAccessToken()`; cookie-session logout instead invalidates the session/CSRF token as above. Do not call token-deletion methods on Sanctum's transient SPA session token. These are future requirements, **not installed or tested API functionality**. See [Sanctum's official documentation](https://laravel.com/framework/docs/12.x/sanctum).

## References and limits

- [Laravel request/proxy handling](https://laravel.com/framework/docs/12.x/requests) and [guest-aware policies](https://laravel.com/framework/docs/12.x/authorization).
- [OWASP HTTP headers guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html): header choices and sensitive-response caching.
- [OWASP HSTS guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html): HTTPS persistence and rollout considerations.
- [Apache header tables](https://httpd.apache.org/docs/current/mod/mod_headers.html): avoid duplicate PHP-FPM/edge headers.
- [Nginx headers](https://nginx.org/en/docs/http/ngx_http_headers_module.html), [FastCGI header filtering](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_hide_header) and [TLS server rejection](https://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_reject_handshake).

Review these controls when adding domains, embeds, analytics, upload features, account recovery, APIs, caching or third-party scripts. They change the threat model and may require deliberate CSP, authorization and session changes. Host examples still need target-server testing; this review does not establish that a production deployment is secure.
