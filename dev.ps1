param(
    [ValidateSet('serve', 'setup', 'test', 'php', 'composer')]
    [string] $Task = 'serve'
)

$ErrorActionPreference = 'Stop'
$Arguments = @($args)
$php = Join-Path $PSScriptRoot '.runtime/php-8.4.27/php.exe'
if (-not (Test-Path -LiteralPath $php)) {
    throw 'Install the project runtime first: .\scripts\install-php.ps1'
}

function Invoke-ProjectPhp {
    param([string[]] $CommandArguments)
    & $php @CommandArguments
    if ($LASTEXITCODE -ne 0) { throw "PHP command failed with exit code $LASTEXITCODE." }
}

function Invoke-ProjectComposer {
    param([string[]] $CommandArguments)
    $composerCommand = Get-Command composer -ErrorAction Stop
    $composerPhar = Join-Path (Split-Path -Parent $composerCommand.Source) 'composer.phar'
    if (-not (Test-Path -LiteralPath $composerPhar)) {
        throw 'Install Composer for Windows from getcomposer.org, then retry.'
    }
    Invoke-ProjectPhp -CommandArguments (@($composerPhar) + $CommandArguments)
}

# Child processes (Composer scripts and Artisan's server) must use the same PHP.
$previousPath = $env:PATH
$env:PATH = (Split-Path -Parent $php) + [System.IO.Path]::PathSeparator + $previousPath
Push-Location $PSScriptRoot
try {
    switch ($Task) {
        'serve' { Invoke-ProjectPhp -CommandArguments @('artisan', 'serve', '--host=127.0.0.1', '--port=3000') }
        'test' { Invoke-ProjectPhp -CommandArguments (@('artisan', 'test') + $Arguments) }
        'php' { Invoke-ProjectPhp -CommandArguments $Arguments }
        'composer' { Invoke-ProjectComposer -CommandArguments $Arguments }
        'setup' {
            Invoke-ProjectComposer -CommandArguments @('install')
            if (-not (Test-Path -LiteralPath '.env')) { Copy-Item -LiteralPath '.env.example' -Destination '.env' }
            $keySetting = Get-Content -LiteralPath '.env' | Where-Object { $_ -match '^APP_KEY=.+$' }
            if (-not $keySetting) { Invoke-ProjectPhp -CommandArguments @('artisan', 'key:generate') }
            if (-not (Test-Path -LiteralPath 'database/database.sqlite')) {
                New-Item -ItemType File -Path 'database/database.sqlite' | Out-Null
            }
            # Adds missing tables/examples; never wipes an existing database or rotates a key.
            Invoke-ProjectPhp -CommandArguments @('artisan', 'migrate', '--seed')
        }
    }
} finally {
    Pop-Location
    $env:PATH = $previousPath
}
