<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Copy this file to public_html/index.php when the private app folder is
// its sibling named 'verisale'. Keep .env, vendor and SQLite outside public_html.
$applicationPath = dirname(__DIR__).'/verisale';
if (file_exists($maintenance = $applicationPath.'/storage/framework/maintenance.php')) {
    require $maintenance;
}
require $applicationPath.'/vendor/autoload.php';

/** @var Application $app */
$app = require $applicationPath.'/bootstrap/app.php';
$app->usePublicPath(__DIR__);
$app->handleRequest(Request::capture());
