<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSecureTransport
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! config('security.require_https')) {
            return $next($request);
        }

        $url = rtrim((string) config('app.url'), '/');
        $parts = parse_url($url);
        // Fail closed if deployment has no canonical HTTPS origin configured.
        abort_unless(is_array($parts) && ($parts['scheme'] ?? '') === 'https'
            && filled($parts['host'] ?? null) && empty($parts['user']) && empty($parts['pass'])
            && empty($parts['query']) && empty($parts['fragment']) && empty($parts['path']), 503);

        abort_unless(strcasecmp($request->getHost(), $parts['host']) === 0, 400);

        if (! $request->isSecure()) {
            // Use configured origin, never a browser-supplied Host or redirect parameter.
            return redirect($url.$request->getRequestUri(), 308);
        }

        return $next($request);
    }
}
