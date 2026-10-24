# Install a verified, project-local Windows CLI runtime. No administrator access or global PATH change.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$version = '8.4.27'
$archiveHash = '93bd8a815a52156606fb906d0573437908c61f96e2cc52c03a51e36a41bf5236'
$runtimeRoot = Join-Path $projectRoot '.runtime'
$phpDirectory = Join-Path $runtimeRoot "php-$version"
$archive = Join-Path $runtimeRoot "php-$version.zip"
$php = Join-Path $phpDirectory 'php.exe'

New-Item -ItemType Directory -Path $runtimeRoot -Force | Out-Null
if (-not (Test-Path -LiteralPath $php)) {
    if (Test-Path -LiteralPath $phpDirectory) {
        throw "An incomplete runtime exists at $phpDirectory. Inspect it before retrying."
    }
    Write-Host "Downloading PHP $version from php.net..."
    Invoke-WebRequest -UseBasicParsing -Uri "https://downloads.php.net/~windows/releases/archives/php-$version-nts-Win32-vs17-x64.zip" -OutFile $archive
    if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne $archiveHash) {
        throw 'PHP download checksum mismatch. The archive will not be extracted or executed.'
    }
    Expand-Archive -LiteralPath $archive -DestinationPath $phpDirectory
}

# cURL/OpenSSL need a current trusted CA bundle for Composer and Stripe HTTPS calls.
$caFile = Join-Path $phpDirectory 'cacert.pem'
$caDownload = Join-Path $runtimeRoot 'cacert-download.pem'
Invoke-WebRequest -UseBasicParsing -Uri 'https://curl.se/ca/cacert.pem' -OutFile $caDownload
$publishedCaHash = (Invoke-WebRequest -UseBasicParsing -Uri 'https://curl.se/ca/cacert.pem.sha256').Content
if ($publishedCaHash -is [byte[]]) {
    $publishedCaHash = [System.Text.Encoding]::ASCII.GetString($publishedCaHash)
}
$expectedCaHash = [regex]::Match([string] $publishedCaHash, '(?i)\b[0-9a-f]{64}\b').Value
if (-not $expectedCaHash -or (Get-FileHash -LiteralPath $caDownload -Algorithm SHA256).Hash -ine $expectedCaHash) {
    throw 'CA bundle checksum mismatch. Existing trusted certificates were not replaced.'
}
Copy-Item -LiteralPath $caDownload -Destination $caFile -Force

$extensionDirectory = (Join-Path $phpDirectory 'ext').Replace('\', '/')
$certificatePath = $caFile.Replace('\', '/')
$errorLog = (Join-Path $runtimeRoot 'php-error.log').Replace('\', '/')
$ini = @"
; Local CLI/development configuration. Production uses deploy/php-production.ini.
extension_dir="$extensionDirectory"
extension=curl
extension=fileinfo
extension=intl
extension=mbstring
extension=openssl
extension=pdo_sqlite
extension=sqlite3
extension=zip
date.timezone=Europe/Riga
memory_limit=256M
error_reporting=E_ALL
display_errors=Off
display_startup_errors=Off
log_errors=On
error_log="$errorLog"
expose_php=Off
zend.exception_ignore_args=On
curl.cainfo="$certificatePath"
openssl.cafile="$certificatePath"
session.use_strict_mode=1
session.use_only_cookies=1
session.cookie_httponly=1
session.cookie_samesite=Lax
"@
[System.IO.File]::WriteAllText((Join-Path $phpDirectory 'php.ini'), $ini, [System.Text.UTF8Encoding]::new($false))
& $php -v
if ($LASTEXITCODE -ne 0) {
    throw 'PHP could not start. Install the official Microsoft Visual C++ 2015-2022 x64 Redistributable, then retry.'
}
& $php -r 'foreach (["curl", "dom", "fileinfo", "intl", "mbstring", "openssl", "pdo_sqlite", "sqlite3", "zip"] as $extension) { if (!extension_loaded($extension)) { fwrite(STDERR, "Missing extension: ".$extension.PHP_EOL); exit(1); } }'
if ($LASTEXITCODE -ne 0) { throw 'Required PHP extensions could not be loaded.' }
Write-Host 'Ready. Use .\dev.ps1 setup, .\dev.ps1 serve, or .\dev.ps1 test.'
