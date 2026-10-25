$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$artifactRoot = Join-Path $projectRoot 'artifacts/hostinger'
$packageRoot = Join-Path $artifactRoot ('upload-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$privateRoot = Join-Path $packageRoot 'verisale'
$publicRoot = Join-Path $packageRoot 'public_html'
New-Item -ItemType Directory -Path $privateRoot, $publicRoot -Force | Out-Null

# Explicit source list: never include .env, a user's database, logs, sessions,
# Git history, Node dependencies, local runtime or a development vendor folder.
foreach ($folder in @('app', 'config', 'lang', 'resources', 'routes')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $folder) -Destination $privateRoot -Recurse
}
foreach ($folder in @('migrations', 'seeders', 'fixtures')) {
    New-Item -ItemType Directory -Path (Join-Path $privateRoot 'database') -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $projectRoot "database/$folder") -Destination (Join-Path $privateRoot 'database') -Recurse
}
New-Item -ItemType Directory -Path (Join-Path $privateRoot 'bootstrap/cache') -Force | Out-Null
foreach ($file in @('app.php', 'providers.php')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "bootstrap/$file") -Destination (Join-Path $privateRoot 'bootstrap')
}
foreach ($file in @('artisan', 'composer.json', 'composer.lock')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $privateRoot
}
Copy-Item -LiteralPath (Join-Path $projectRoot 'deploy/hostinger.env.example') -Destination (Join-Path $privateRoot '.env.example')
foreach ($folder in @('app/private', 'framework/cache/data', 'framework/sessions', 'framework/views', 'logs')) {
    New-Item -ItemType Directory -Path (Join-Path $privateRoot "storage/$folder") -Force | Out-Null
}
foreach ($folder in @('css', 'js', 'fonts', 'media')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "public/$folder") -Destination $publicRoot -Recurse
}
foreach ($file in @('riga-facade.jpg', 'property-interior.jpg', 'property-research.jpg', 'robots.txt', 'ASSETS.md')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "public/$file") -Destination $publicRoot
}
Copy-Item -LiteralPath (Join-Path $projectRoot 'deploy/hostinger-index.php') -Destination (Join-Path $publicRoot 'index.php')
Copy-Item -LiteralPath (Join-Path $projectRoot 'deploy/hostinger.htaccess') -Destination (Join-Path $publicRoot '.htaccess')
Copy-Item -LiteralPath (Join-Path $projectRoot 'docs/HOSTINGER.md') -Destination (Join-Path $packageRoot 'HOSTINGER.md')
Copy-Item -LiteralPath (Join-Path $projectRoot 'docs/INTEGRATION-VERIFICATION.md') -Destination (Join-Path $packageRoot 'INTEGRATION-VERIFICATION.md')

$archivePath = $packageRoot + '.zip'
Compress-Archive -Path (Join-Path $packageRoot '*') -DestinationPath $archivePath
Write-Output "Source upload package: $archivePath"
Write-Output 'Composer production dependencies must be installed over SSH after upload; no credentials or existing database are included.'
