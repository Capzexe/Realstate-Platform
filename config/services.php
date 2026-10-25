<?php

return [
    'payments' => [
        // Demo payments require BOTH an explicit switch and a local/test environment.
        'demo' => (bool) env('DEMO_PAYMENTS', false),
    ],
    // Read secrets here so Laravel's configuration cache works in production.
    'stripe' => [
        'secret' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'report_price' => 999, // Stripe expects cents: 999 = EUR 9.99.
    ],
    'contact_email' => env('CONTACT_EMAIL', 'info@verisale.ai'),
];
