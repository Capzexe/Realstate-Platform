<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    protected function setTrustedProxyIpAddresses(Request $request): void
    {
        // Do not infer trusted proxies from the Host header or accept a wildcard.
        $proxies = array_values(array_filter(config('security.trusted_proxies', []),
            fn ($ip) => is_string($ip) && ! in_array($ip, ['*', '**', 'REMOTE_ADDR'], true)));

        // Forwarded hosts and prefixes cannot change our payment return URLs.
        $request::setTrustedProxies($proxies, Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_PROTO | Request::HEADER_X_FORWARDED_PORT);
    }
}
