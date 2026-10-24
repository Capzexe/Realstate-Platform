<?php

return [
    // Local development has no TLS certificate. Every deployed environment requires HTTPS.
    'require_https' => ! in_array(env('APP_ENV', 'production'), ['local', 'testing'], true),

    // List only the IPs/CIDRs of reverse proxies you control. Never use '*'.
    'trusted_proxies' => array_values(array_filter(array_map('trim', explode(',', (string) env('TRUSTED_PROXIES', ''))))),

    // The app accepts small forms and Stripe JSON, not browser file uploads.
    'max_request_bytes' => 262144,
];
