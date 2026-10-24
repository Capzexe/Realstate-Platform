<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // The edge server must enforce this limit before PHP parses the request, too.
        abort_if((int) $request->server('CONTENT_LENGTH', 0) > config('security.max_request_bytes'), 413);

        return self::apply($request, $next($request));
    }

    public static function apply(Request $request, Response $response): Response
    {
        $policy = "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; "
            ."script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; "
            ."form-action 'self' https://checkout.stripe.com; frame-src 'none'";

        if (config('security.require_https')) {
            $policy .= '; upgrade-insecure-requests';
            if ($request->isSecure()) {
                // Do not opt all subdomains into HSTS without checking their TLS support.
                $response->headers->set('Strict-Transport-Security', 'max-age=31536000');
            }
        }

        $response->headers->set('Content-Security-Policy', $policy);
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->remove('X-Powered-By');
        // PHP can add this header outside Symfony's response header collection.
        if (! headers_sent()) {
            header_remove('X-Powered-By');
        }

        // These HTML responses can contain purchased data, contact details or payment IDs.
        // Public previews also vary by browser session, so shared caches must not store them.
        $response->headers->set('Cache-Control', 'no-store, private');

        return $response;
    }
}
