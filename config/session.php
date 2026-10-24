<?php

use Illuminate\Support\Str;

$deployed = ! in_array(env('APP_ENV', 'production'), ['local', 'testing'], true);

return [
    // Never store purchase ownership in a browser-readable session payload.
    'driver' => env('SESSION_DRIVER', 'file'),
    'lifetime' => (int) env('SESSION_LIFETIME', 1440),
    'expire_on_close' => false,
    'encrypt' => true,
    'files' => storage_path('framework/sessions'),
    'connection' => env('SESSION_CONNECTION'),
    'table' => 'sessions',
    'store' => env('SESSION_STORE'),
    'lottery' => [2, 100],

    // __Host- cookies require HTTPS, path=/, and no Domain attribute.
    'cookie' => ($deployed ? '__Host-' : '').Str::slug((string) env('APP_NAME', 'laravel')).'-session',
    'path' => '/',
    'domain' => null,
    'secure' => $deployed || (bool) env('SESSION_SECURE_COOKIE', false),
    'http_only' => true,
    // Lax permits the top-level return navigation from Stripe Checkout.
    'same_site' => 'lax',
    'partitioned' => false,
];
