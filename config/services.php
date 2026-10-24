<?php

return [
    // Read secrets here so Laravel's configuration cache works in production.
    'stripe' => [
        'secret' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'report_price' => 999, // Stripe expects cents: 999 = EUR 9.99.
    ],
    'contact_email' => env('CONTACT_EMAIL', 'info@verisale.ai'),
];
