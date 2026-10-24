# Local PHP runtime

The workspace runs **PHP 8.4.27**, the patched PHP 8.4 Windows x64 NTS build published on 21 October 2026. PHP 8.4 is supported for security fixes through December 2028. See the [official download](https://www.php.net/downloads.php?os=windows&version=8.4) and [support schedule](https://www.php.net/supported-versions.php).

## Windows commands

From the repository root, with Composer 2 installed:

```powershell
.\scripts\install-php.ps1
.\dev.ps1 setup
.\dev.ps1 serve
```

`setup` installs Composer dependencies, creates `.env` and an application key only when missing, creates the default SQLite file if needed, and runs migrations/seeding. It never runs `migrate:fresh`, deletes existing records, or replaces an existing application key. Use the local environment from `.env.example`; do not run a demo setup against a production database.

Useful commands:

```powershell
.\dev.ps1 php -v
.\dev.ps1 test --compact
.\dev.ps1 php artisan db:seed
.\dev.ps1 php vendor/bin/pint --test
.\dev.ps1 composer check-platform-reqs
.\dev.ps1 composer audit
```

The helper temporarily prepends `.runtime/php-8.4.27` to its child process PATH. PHP, Composer scripts and the preview server therefore share one runtime. The shared XAMPP installation and system/user PATH are unchanged. A plain `php` command in another shell may still resolve to XAMPP 8.2; use the helper for this project, or select a current PHP version in your own development environment.

## What the installer does

- Downloads the official PHP archive over HTTPS and verifies its published SHA-256 before extracting or running it.
- Installs it inside the Git-ignored `.runtime/` directory. Runtime binaries, certificates, logs and local database backups are not portfolio source files.
- Downloads the Mozilla CA bundle maintained by curl, verifies its checksum and configures cURL/OpenSSL to use it. TLS verification remains enabled.
- Enables cURL, Fileinfo, Intl, Mbstring, OpenSSL, PDO SQLite, SQLite3 and Zip. XML/DOM are included in the build.
- Disables PHP version disclosure and browser error display, and logs PHP errors locally. Laravel debug details remain available only in explicitly local/testing environments.

The official build needs the Microsoft Visual C++ 2015–2022 x64 Redistributable. If a required dependency is missing, use the [Microsoft installer linked by PHP](https://aka.ms/vs/17/release/vc_redist.x64.exe). If an organisation's application-control policy blocks a DLL, use an approved runtime or ask its administrator to review the official package; do not disable application-control protections.

To update later, check the official download/support pages, update the version and published archive checksum in `scripts/install-php.ps1`, update the runtime path in `dev.ps1`, then rerun installation, platform checks, tests and dependency auditing. Keep the CA bundle current by rerunning the installer. Never copy old PHP extension DLLs into a new PHP version.

## Local database

`database/database.sqlite` contains 12 fictional properties with 36 sales after seeding. It stays outside the public web root and is ignored by Git. Recruiters regenerate the same data from migrations and `database/fixtures/properties.php`; they do not need a committed binary database.

The existing local database was backed up under `.runtime/backups/` before adding the new records. Tests use SQLite in memory, so test runs cannot erase the preview's data.

## Production

The portable CLI runtime is for local development. A deployed host must use a current patched PHP-FPM/Apache runtime, real TLS, private filesystem permissions and the reviewed configuration examples. Follow [the security deployment guide](SECURITY-AUDIT.md). CI checks PHP 8.4; Windows runtime checks and the local preview were also run on 8.4.27.
